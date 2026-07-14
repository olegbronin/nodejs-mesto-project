import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
<<<<<<< HEAD
import { isMongooseError } from '../types/error';
=======
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import NotFoundError from '../errors/not-found-err';
import UnauthorizedError from '../errors/unauthorized-err';
import ConflictError from '../errors/conflict-err';
import { IError } from '../errors/error-interface';
import { MongoError } from 'mongodb';
>>>>>>> 78491c7b5f0875e41a44b1ed1bb75d0868533043

import * as Constants from '../constants/constants';

declare global {
  interface Error {
    statusCode?: number;
  }
}
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    const usersResponse = users.map((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    });
    res.status(Constants.ERROR_CODE_200).send(usersResponse);
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

    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(Constants.ERROR_CODE_200).send(userResponse);
  } catch (err) {
<<<<<<< HEAD
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(Constants.ERROR_CODE_400).send({ message: 'Передан некорректный _id пользователя' });
    }
    return res.status(Constants.ERROR_CODE_500).send({ message: Constants.ERROR_CODE_500_MESSAGE });
=======
    next(err);
>>>>>>> 78491c7b5f0875e41a44b1ed1bb75d0868533043
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
<<<<<<< HEAD
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(Constants.ERROR_CODE_201).send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(Constants.ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании пользователя' });
=======
    const userId = req.user?._id;

    if (!userId) {
      const err = new Error('Пользователь не авторизован');
      err.statusCode = Constants.ERROR_CODE_401;
      return next(err);
>>>>>>> 78491c7b5f0875e41a44b1ed1bb75d0868533043
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь с таким idне найден');
    }

    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(Constants.ERROR_CODE_200).send(userResponse);
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
    const response = user.toObject();
    delete response.password;
    res.status(Constants.ERROR_CODE_201).send(response);
  } catch (err) {
    const mongoError = err as MongoError;
    if (mongoError.code === 11000) {
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

<<<<<<< HEAD
    return res.status(Constants.ERROR_CODE_200).send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(Constants.ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    return res.status(Constants.ERROR_CODE_500).send({ message: Constants.ERROR_CODE_500_MESSAGE });
=======
    res.status(Constants.ERROR_CODE_200).send(user);
  } catch (err) {
    next(err);
>>>>>>> 78491c7b5f0875e41a44b1ed1bb75d0868533043
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
<<<<<<< HEAD
      return res.status(Constants.ERROR_CODE_404).send({ message: Constants.ERROR_CODE_404_MESSAGE_USER });
    }

    return res.status(Constants.ERROR_CODE_200).send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(Constants.ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
=======
      throw new NotFoundError('Нет пользователя с таким id');
>>>>>>> 78491c7b5f0875e41a44b1ed1bb75d0868533043
    }

    res.status(Constants.ERROR_CODE_200).send(user);
  } catch (err) {
    next(err);
  }
<<<<<<< HEAD
=======
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
>>>>>>> 78491c7b5f0875e41a44b1ed1bb75d0868533043
};