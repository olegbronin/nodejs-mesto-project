import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { isMongooseError } from '../types/error';

import * as Constants from '../constants/constants';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find();
    res.status(Constants.ERROR_CODE_200).send(cards);
  } catch (err) {
    next(err);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;

    const card = await Card.create({ name, link, owner });
    return res.status(Constants.ERROR_CODE_201).send(card);
  } catch (err) {
<<<<<<< HEAD
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(Constants.ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    return res.status(Constants.ERROR_CODE_500).send({ message: Constants.ERROR_CODE_500_MESSAGE });
=======
    next(err);
>>>>>>> 78491c7b5f0875e41a44b1ed1bb75d0868533043
  }
};

export const deleteCardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    const userId = req.user?._id;

    if (!userId) {
      return res.status(Constants.ERROR_CODE_401).send({
        message: 'Необходимо авторизироваться'
      });
    }

    if (!card) {
      return res.status(Constants.ERROR_CODE_404).send({ message: Constants.ERROR_CODE_404_MESSAGE_CARD });
    }

    if (card.owner.toString() !== userId) {
      return res.status(Constants.ERROR_CODE_403).send({
        message: 'Вы не можете удалять карточки других пользователей'
      });
    }

    await Card.findByIdAndDelete(cardId);
    return res.status(Constants.ERROR_CODE_200).send({ message: 'Карточка успешно удалена' });
  } catch (err) {
<<<<<<< HEAD
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(Constants.ERROR_CODE_400).send({ message: 'Передан некорректный _id карточки' });
    }
    return res.status(Constants.ERROR_CODE_500).send({ message: Constants.ERROR_CODE_500_MESSAGE });
=======
    next(err);
>>>>>>> 78491c7b5f0875e41a44b1ed1bb75d0868533043
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const userId = req.user?._id;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!card) {
      return res.status(Constants.ERROR_CODE_404).send({ message: Constants.ERROR_CODE_404_MESSAGE_CARD });
    }

    return res.status(Constants.ERROR_CODE_200).send(card);
  } catch (err) {
<<<<<<< HEAD
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(Constants.ERROR_CODE_400).send({ message: 'Передан некорректный _id карточки' });
    }
    return res.status(Constants.ERROR_CODE_500).send({ message: Constants.ERROR_CODE_500_MESSAGE });
=======
    next(err);
>>>>>>> 78491c7b5f0875e41a44b1ed1bb75d0868533043
  }
};

export const unlikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const userId = req.user?._id;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      return res.status(Constants.ERROR_CODE_404).send({ message: Constants.ERROR_CODE_404_MESSAGE_CARD });
    }

    return res.status(Constants.ERROR_CODE_200).send(card);
  } catch (err) {
<<<<<<< HEAD
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(Constants.ERROR_CODE_400).send({ message: 'Передан некорректный _id карточки' });
    }
    return res.status(Constants.ERROR_CODE_500).send({ message: Constants.ERROR_CODE_500_MESSAGE });
=======
    next(err);
>>>>>>> 78491c7b5f0875e41a44b1ed1bb75d0868533043
  }
};