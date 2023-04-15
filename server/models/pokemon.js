const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Pokemon = new Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  abilities: {
    type: [String],
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  evolution: {
    type: [String],
    required: true,
  },
  userPokemons: [
    {
      userId: { type: Schema.Types.String, ref: "PokemonUser" },
      pokemonsID: { type: Schema.Types.Number, ref: "PokemonUser" },
      addedAt: { type: Date },
    },
  ],
});

module.exports = mongoose.model("pokemons", Pokemon);
