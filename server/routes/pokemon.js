const express = require("express");

const Pokemon = require("../controllers/pokemon");
const UserPokemon = require("../controllers/userPokemon");

const router = express.Router();

router.post("/pokemons", Pokemon.createPokemons);
router.get("/pokemon/:id", Pokemon.getPokemonById);
router.get("/pokemons", Pokemon.getPokemons);

router.post("/user-pokemons/evolve", UserPokemon.evolveUserPokemons);
router.get("/user-pokemons/:userId", UserPokemon.getUserPokemons);
router.post("/user-pokemons/add", UserPokemon.addUserPokemon);

module.exports = router;
