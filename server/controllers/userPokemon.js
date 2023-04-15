const ethSigUtil = require("@metamask/eth-sig-util");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const UserPokemon = require("../models/userPokemon");
const Pokemon = require("../models/pokemon");

const getUserPokemons = async (req, res) => {
  let userId = req.params.userId;
  if (!req.params.userId) {
    return res
      .status(400)
      .send({ sucess: false, message: "No userId specified" });
  }

  // TODO implment pagination
  userId = userId.toLowerCase();
  await UserPokemon.find({ userId })
    .then((pokemons) => {
      if (!pokemons.length) {
        return res
          .status(404)
          .json({ success: false, error: `User pokemons not found` });
      }
      return res.status(200).json({ success: true, data: pokemons });
    })
    .catch((err) => res.status(400).json({ success: false, err }));
};
const evolveUserPokemons = async (req, res) => {
  // userPokemonsIDFrom,
  // userPokemonsIDto,
  // signedMessage
  // -------
  const { userPokemonsIDFrom, userPokemonsIDto, signedMessage } = req.body;
  if (!userPokemonsIDFrom || !userPokemonsIDto || !signedMessage) {
    return res.status(400).json({
      success: false,
      err: "Invalid input. Specify userPokemonsIDFrom, userPokemonsIDto and signedMessage",
    });
  }

  let pokemonFrom, pokemonTo;
  try {
    [pokemonFrom, pokemonTo] = await Promise.all([
      Pokemon.findOne({ id: userPokemonsIDFrom }),
      Pokemon.findOne({ id: userPokemonsIDto }),
    ]);
  } catch (err) {
    return res.status(400).json("Failed to get pokemons");
  }

  if (!pokemonFrom || !pokemonTo) {
    return res.status(404).json("At least one pokemon not found");
  }

  let userId;
  try {
    userId = ethSigUtil.recoverPersonalSignature({
      data: `I want evolve ${pokemonFrom.name} to ${pokemonTo.name}`,
      signature: signedMessage,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, err: "Incorrect signed message" });
  }

  try {
    const [userPokemonFrom, userPokemonTo] = await Promise.all([
      UserPokemon.findOne({
        pokemonsID: userPokemonsIDFrom,
        userId,
      }),
      UserPokemon.findOne({ pokemonsID: userPokemonsIDto, userId }),
    ]);

    if (!userPokemonFrom || !userPokemonTo) {
      return res
        .status(400)
        .json({ success: false, err: "Both pokemons should be owned by user" });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, err: "Failed to get user pokemons" });
  }

  try {
    pokemonFrom = await Pokemon.findOneAndUpdate(
      { id: userPokemonsIDFrom },
      { $push: { evolution: `${pokemonTo.id}` } }
    );
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, err: "Failed to update pokemon" });
  }

  try {
    await UserPokemon.findOneAndUpdate(
      { pokemonsID: userPokemonsIDFrom, userId },
      { evolvedAt: new Date() }
    );
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, err: "Failed to update user pokemon" });
  }

  return res.status(200).json({ success: true, data: pokemonFrom });
};

const addUserPokemon = async (req, res) => {
  const body = req.body;

  const { signedMessage, pokemonsID } = body;

  if (!signedMessage || !pokemonsID) {
    return res
      .status(400)
      .json("Invalid input. Specify signedMessage and pokemonsID");
  }

  const pokemon = await Pokemon.findOne({ id: pokemonsID });
  if (!pokemon) {
    return res
      .status(404)
      .json({ success: false, err: "Pokemon with id not found" });
  }

  let userId;
  try {
    userId = ethSigUtil.recoverPersonalSignature({
      data: `I want add ${pokemon.name} to my list`,
      signature: signedMessage,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, err: "Incorrect signed message" });
  }

  let userPokemon = await UserPokemon.findOne({ pokemonsID, userId });
  if (userPokemon) {
    return res.status(400).json({
      success: false,
      err: "That pokemon already exists for that particular user",
    });
  }

  userPokemon = new UserPokemon({
    userId,
    pokemonsID,
    addedAt: new Date(),
  });

  try {
    await userPokemon.save();
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, err: "Failed to create user pokemon" });
  }

  try {
    await Pokemon.findOneAndUpdate(
      { id: pokemonsID },
      {
        $push: { userPokemons: userPokemon },
      }
    );
  } catch (err) {
    return res.status(400).json({
      success: false,
      err: "Failed to update pokemon with user pokemon data",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      pokemonsID: userPokemon.pokemonsID,
      userId: userPokemon.userId,
      addedAt: userPokemon.addedAt,
    },
  });
};

module.exports = {
  getUserPokemons,
  evolveUserPokemons,
  addUserPokemon,
};
