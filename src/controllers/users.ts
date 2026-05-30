import { Request, Response } from 'express';
import User from '../models/user';

const ERROR_CODE_200 = 200;
const ERROR_CODE_201 = 201;
const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

const ERROR_CODE_404_MESSAGE = 'пользователь не найден';
const ERROR_CODE_500_MESSAGE = 'ошибка по умолчанию';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(ERROR_CODE_200).send(users);
  } catch (err) {
    res.status(ERROR_CODE_500).send({ message: ERROR_CODE_500_MESSAGE });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(ERROR_CODE_404).send({ message: ERROR_CODE_404_MESSAGE });
    }
    return res.status(ERROR_CODE_200).send(user);
  } catch (err) {
    if ((err as any).name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: 'Передан некорректный _id пользователя' });
    }
    return res.status(ERROR_CODE_500).send({ message: ERROR_CODE_500_MESSAGE });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(ERROR_CODE_201).send(user);
  } catch (err) {
    if ((err as any).name === 'ValidationError') {
      return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(ERROR_CODE_500).send({ message: ERROR_CODE_500_MESSAGE });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(ERROR_CODE_404).send({ message: ERROR_CODE_404_MESSAGE });
    }

    return res.status(200).send(user);
  } catch (err) {
    if ((err as any).name === 'ValidationError') {
      return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    return res.status(ERROR_CODE_500).send({ message: ERROR_CODE_500_MESSAGE });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    return res.status(200).send(user);
  } catch (err) {
    if ((err as any).name === 'ValidationError') {
      return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    return res.status(ERROR_CODE_500).send({ message: ERROR_CODE_500_MESSAGE });
  }
};
