const Card = require('../models/card');

const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');
const ForbiddenError = require('../utils/errors/ForbiddenError');

const { CORRECT_CODE, CREATE_CODE } = require('../utils/goodcodes');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((data) => {
      res.status(CREATE_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequest('Данные не прошли валидацию на сервере'));
      } else {
        next(error);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(CORRECT_CODE).send(cards);
    })
    .catch(next);
};

module.exports.deleteCardsId = (req, res, next) => {
  const cardId = req.params.id;
  const id = req.user._id;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound(`Карточка с указанным id: ${cardId} не существует`);
      }
      if (card.owner.toString() !== id) {
        throw new ForbiddenError('Недостаточно прав для удаления карточки');
      } else {
        Card.findByIdAndRemove(cardId)
          .then((data) => {
            res.status(CORRECT_CODE).send(data);
          })
          .catch((error) => {
            if (error.name === 'CastError') {
              next(new BadRequest(`Передан невалидный id:${cardId} карточки`));
            } else {
              next(error);
            }
          });
      }
    })
    .catch(next);
};

module.exports.putLikesOnCards = (req, res, next) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFound(`Карточка с указанным id:${cardId} не существует`);
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest(`Передан невалидный id:${cardId} карточки`));
      } else {
        next(error);
      }
    });
};

module.exports.deleteLikesFromCards = (req, res, next) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFound(`Карточка с указанным id:${cardId} не существует`);
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequest(`Передан невалидный id:${cardId} карточки`));
      } else {
        next(error);
      }
    });
};
