const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, getCards, deleteCardsId, putLikesOnCards, deleteLikesFromCards,
} = require('../controllers/cards');

cardsRouter.get('/cards', getCards);
cardsRouter.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required()
        .regex(/^(https?:\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w.-]*)*\/?$/),
    }),
  }),
  createCard,
);

cardsRouter.delete(
  '/cards/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().hex().length(24),
    }),
  }),
  deleteCardsId,
);
cardsRouter.put(
  '/cards/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().hex().length(24),
    }),
  }),
  putLikesOnCards,
);

cardsRouter.delete(
  '/cards/:id/likes',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().hex().length(24),
    }),
  }),
  deleteLikesFromCards,
);

module.exports = cardsRouter;
