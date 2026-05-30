import { Request, Response } from 'express';
import Card from '../models/card';

const ERROR_CODE_200 = 200;
const ERROR_CODE_201 = 201;
const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

const ERROR_CODE_404_MESSAGE = 'карточка не найдена';
const ERROR_CODE_500_MESSAGE = 'ошибка по умолчанию';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find();
    res.status(ERROR_CODE_200).send(cards);
  } catch (err) {
    res.status(ERROR_CODE_500).send({ message: ERROR_CODE_500_MESSAGE });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const owner = (req as any).user?._id;

    const card = await Card.create({ name, link, owner });
    return res.status(ERROR_CODE_201).send(card);
  } catch (err) {
    if ((err as any).name === 'ValidationError') {
      return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    return res.status(ERROR_CODE_500).send({ message: ERROR_CODE_500_MESSAGE });
  }
};

export const deleteCardById = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);

    if (!card) {
      return res.status(ERROR_CODE_404).send({ message: ERROR_CODE_404_MESSAGE });
    }

    return res.status(ERROR_CODE_200).send({ message: 'Карточка успешно удалена' });
  } catch (err) {
    if ((err as any).name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: 'Передан некорректный _id карточки' });
    }
    return res.status(ERROR_CODE_500).send({ message: ERROR_CODE_500_MESSAGE });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const userId = (req as any).user?._id;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!card) {
      return res.status(ERROR_CODE_404).send({ message: ERROR_CODE_404_MESSAGE });
    }

    return res.status(ERROR_CODE_200).send(card);
  } catch (err) {
    if ((err as any).name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: 'Передан некорректный _id карточки' });
    }
    return res.status(ERROR_CODE_500).send({ message: ERROR_CODE_500_MESSAGE });
  }
};

export const unlikeCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const userId = (req as any).user?._id;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      return res.status(ERROR_CODE_404).send({ message: ERROR_CODE_404_MESSAGE });
    }

    return res.status(ERROR_CODE_200).send(card);
  } catch (err) {
    if ((err as any).name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: 'Передан некорректный _id карточки' });
    }
    return res.status(ERROR_CODE_500).send({ message: ERROR_CODE_500_MESSAGE });
  }
};
