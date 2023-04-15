const mongoose = require("mongoose");

// TODO use env for db path
mongoose
  .connect("mongodb://127.0.0.1:27017/pokemons", { useNewUrlParser: true })
  .catch((e) => {
    console.error("Connection error", e.message);
  });

const db = mongoose.connection;

module.exports = db;
