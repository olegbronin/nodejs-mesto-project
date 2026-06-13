import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import NotFoundError from '../errors/not-found-err';
import UnauthorizedError from '../errors/unauthorized-err';
import ConflictError from '../errors/conflict-err';

import * as Constants from '../constants/constants';

declare global {
  interface Error {
    statusCode?: number;
  }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.status(Constants.ERROR_CODE_200).send(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь с таким idне найден');
    }

    res.status(Constants.ERROR_CODE_200).send(user);
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      const err = new Error('Пользователь не авторизован');
      err.statusCode = Constants.ERROR_CODE_401;
      return next(err);
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь с таким idне найден');
    }

    res.status(Constants.ERROR_CODE_200).send(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    if (!validator.isEmail(email)) {
      const err = new Error('Передан некорректный email');
      err.statusCode = Constants.ERROR_CODE_400;
      return next(err);
    }

    const user = await User.create({ name, about, avatar, email, password });
    res.status(Constants.ERROR_CODE_201).send(user);
  } catch (err) {
    if ((err as any).code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    } else {
      next(err);
    }
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { name, about } = req.body;

    if (!userId) {
      const err = new Error('Пользователь не авторизован');
      err.statusCode = Constants.ERROR_CODE_401;
      return next(err);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError('Пользователь с таким idне найден');
    }

    res.status(Constants.ERROR_CODE_200).send(user);
  } catch (err) {
    next(err);
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { avatar } = req.body;

    if (!userId) {
      const err = new Error('Пользователь не авторизован');
      err.statusCode = Constants.ERROR_CODE_401;
      return next(err);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }

    res.status(Constants.ERROR_CODE_200).send(user);
  } catch (err) {
    next(err);
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new Error('Необходимо передать email и пароль');
    err.statusCode = Constants.ERROR_CODE_400;
    return next(err);
  }

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET || 'some-secret-key',
            { expiresIn: '7d' }
          );

          res.status(Constants.ERROR_CODE_200).send({ token });
        });
    })
    .catch(next);
};