const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Pokemon = require("../models/pokemon");

const createPokemons = async (req, res) => {
  const body = req.body;

  if (!body || body.pokemons?.length === 0) {
    return res.status(400).json({
      success: false,
      error: "You must provide a list of pokemons",
    });
  }

  const promises = [];
  for (const pokemonObj of body.pokemons) {
    const pokemon = new Pokemon(pokemonObj);

    if (!pokemon) {
      return res.status(400).json({ success: false, error: "Invalid pokemon" });
    }

    promises.push(pokemon.save());
  }

  await Promise.all(promises)
    .then(() => {
      return res.status(201).json({
        success: true,
        message: "Pokemons created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Pokemons were not created!",
      });
    });
};

const getPokemons = async (req, res) => {
  // TODO implement pagination

  await Pokemon.find({}, { __v: 0 })
    .then((pokemons) => {
      if (!pokemons.length) {
        return res
          .status(404)
          .json({ success: false, error: `Pokemons not found` });
      }
      return res.status(200).json({ success: true, data: pokemons });
    })
    .catch((err) => res.status(400).json({ success: false, error: err }));
};

const getPokemonById = async (req, res) => {
  try {
    new ObjectId(req.params.id);
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, error: "Incorrect pokemon id" });
  }

  await Pokemon.findOne({ id: req.params.id }, { _id: 0, __v: 0 })
    .then((pokemon) => {
      if (!pokemon) {
        return res
          .status(404)
          .json({ success: false, error: `Pokemon not found` });
      }
      return res.status(200).json({ success: true, data: pokemon });
    })
    .catch((err) => res.status(400).json({ success: false, error: err }));
};

module.exports = {
  createPokemons,
  getPokemons,
  getPokemonById,
};
