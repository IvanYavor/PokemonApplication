const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserPokemon = new Schema({
  pokemonsID: {
    type: Number,
    required: true,
  },
  userId: { type: Schema.Types.String, required: true },
  addedAt: { type: Date, required: true },
  evolvedAt: { type: Date },
});

module.exports = mongoose.model("userPokemons", UserPokemon);
