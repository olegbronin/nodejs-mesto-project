import { Request, Response } from 'express';
import User from '../models/user';
import { isMongooseError } from '../types/error';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import * as Constants from '../constants/constants';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(Constants.ERROR_CODE_200).send(users);
  } catch (err) {
    res.status(Constants.ERROR_CODE_500).send({ message: Constants.ERROR_CODE_500_MESSAGE });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(Constants.ERROR_CODE_404).send({ message: Constants.ERROR_CODE_404_MESSAGE_USER });
    }
    return res.status(Constants.ERROR_CODE_200).send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(Constants.ERROR_CODE_400).send({ message: 'Передан некорректный _id пользователя' });
    }
    return res.status(Constants.ERROR_CODE_500).send({ message: Constants.ERROR_CODE_500_MESSAGE });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    if(!validator.isEmail(email)) {
      return res.status(Constants.ERROR_CODE_400).send({ message: 'Передан некорректный email' })
    }
    const user = await User.create({ name, about, avatar, email, password });
    return res.status(Constants.ERROR_CODE_201).send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(Constants.ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(Constants.ERROR_CODE_500).send({ message: Constants.ERROR_CODE_500_MESSAGE });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(Constants.ERROR_CODE_404).send({ message: Constants.ERROR_CODE_404_MESSAGE_USER });
    }

    return res.status(Constants.ERROR_CODE_200).send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(Constants.ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    return res.status(Constants.ERROR_CODE_500).send({ message: Constants.ERROR_CODE_500_MESSAGE });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(Constants.ERROR_CODE_404).send({ message: Constants.ERROR_CODE_404_MESSAGE_USER });
    }

    return res.status(Constants.ERROR_CODE_200).send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(Constants.ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    return res.status(Constants.ERROR_CODE_500).send({ message: Constants.ERROR_CODE_500_MESSAGE });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(Constants.ERROR_CODE_400).send({
        message: 'Необходимо передать email и пароль'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(Constants.ERROR_CODE_401).send({
        message: 'Пользоваетль не найден. Проверьте почту и пароль'
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(Constants.ERROR_CODE_401).send({
        message: 'Введен неверный пароль'
      });
    }

    const token = jwt.sign(
      { _id: user._id },
      'some-secret-key',
      { expiresIn: '7d' }
    );

    return res.status(Constants.ERROR_CODE_200).send({ token });

  } catch (err) {
    return res.status(Constants.ERROR_CODE_500).send({
      message: Constants.ERROR_CODE_500_MESSAGE
    });
  }
}