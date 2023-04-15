const mongoose = require("mongoose");
const PokemonModel = require("../../models/pokemon");

describe("PokemonModel", () => {
  beforeAll(async () => {
    // Connect to a test database before running the tests
    await mongoose.connect("mongodb://localhost/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Disconnect from the test database after all tests are finished
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clear the database after each test
    await PokemonModel.deleteMany({});
  });

  it("should be able to save a new Pokemon", async () => {
    const pokemon = new PokemonModel({
      id: 1,
      name: "Pikachu",
      imageUrl: "https://pokeapi.co/api/v2/pokemon/25",
      type: "Electric",
      abilities: ["Static", "Lightning Rod"],
      level: 10,
      evolution: ["Pichu", "Raichu"],
      userPokemons: [],
    });

    await pokemon.save();

    const savedPokemon = await PokemonModel.findOne({ name: "Pikachu" });
    expect(savedPokemon).toMatchObject({
      id: 1,
      name: "Pikachu",
      imageUrl: "https://pokeapi.co/api/v2/pokemon/25",
      type: "Electric",
      abilities: ["Static", "Lightning Rod"],
      level: 10,
      evolution: ["Pichu", "Raichu"],
      userPokemons: [],
    });
  });

  it("should not be able to save a Pokemon without a required field", async () => {
    const pokemon = new PokemonModel({
      id: 1,
      imageUrl: "https://pokeapi.co/api/v2/pokemon/25",
      type: "Electric",
      abilities: ["Static", "Lightning Rod"],
      level: 10,
      evolution: ["Pichu", "Raichu"],
      userPokemons: [],
    });

    let error;
    try {
      await pokemon.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.name).toBeDefined();
  });
});
