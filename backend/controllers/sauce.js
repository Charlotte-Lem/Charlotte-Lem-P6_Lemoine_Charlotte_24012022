const Sauce = require('../models/Sauce');

//on inclut le module FyleSystem qui permet de travailler avec les fichiers
const fs = require('fs');

//création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    userId: sauceObject.userId,
    name: sauceObject.name,
    manufacturer: sauceObject.manufacturer,
    description: sauceObject.description,
    mainPepper: sauceObject.mainPepper,
    heat: sauceObject.heat,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Sauce saved successfully!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//trouver une sauce par son id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

//modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch((error) => res.status(400).json({ error }));
};

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//récuperer toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//////////////////////////////////////////////
// Likes dislikes d'une sauce
//////////////////////////////////////////////

// l'id du user doit être enregistré dans tableau usersLiked usersDisliked
// like ou dislikes unique du user
// mise a jour du nombre total de like et dislike a chaque notation
//////////////////////////////////////////////
/////////////////////////////////////////////
exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //Like = 1
      if (like === 1 && !sauce.usersLiked.includes(userId)) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: userId },
            _id: req.params.id,
          }
        )
          .then(() => res.status(200).json({ message: "J'aime cette sauce !" }))
          .catch((error) => res.status(400).json({ error }));
        //Like = -1
      } else if (req.body.like === -1 && !sauce.usersLiked.includes(userId)) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: userId },
            _id: req.params.id,
          }
        )
          .then(() =>
            res.status(200).json({ message: "Je n'aime pas cette sauce !" })
          )
          .catch((error) => res.status(400).json({ error }));

        //Like = 0 et userId est inclus dans le tableau usersLiked
      } else if (req.body.like === 0 && sauce.usersLiked.includes(userId)) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: userId },
            _id: req.params.id,
          }
        )
          .then(() => res.status(200).json({ message: 'Like supprimé !' }))
          .catch((error) => res.status(400).json({ error }));

        //Like = 0 et userId est inclus dans le tableau usersDisliked
      } else if (req.body.like === 0 && sauce.usersDisliked.includes(userId)) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: userId },
            _id: req.params.id,
          }
        )
          .then(() => res.status(200).json({ message: 'Dislike supprimé!' }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        return res.status(400).json({ error });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
