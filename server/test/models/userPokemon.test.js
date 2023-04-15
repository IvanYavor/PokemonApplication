const mongoose = require("mongoose");
const UserPokemon = require("../../models/userPokemon");

describe("UserPokemon model", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should be able to save a UserPokemon", async () => {
    const userPokemon = new UserPokemon({
      pokemonsID: 1,
      userId: "user123",
      addedAt: new Date(),
      evolvedAt: null,
    });
    const savedUserPokemon = await userPokemon.save();
    expect(savedUserPokemon._id).toBeDefined();
    expect(savedUserPokemon.pokemonsID).toBe(1);
    expect(savedUserPokemon.userId).toBe("user123");
    expect(savedUserPokemon.addedAt).toBeDefined();
    expect(savedUserPokemon.evolvedAt).toBeNull();
  });

  it("should not save a UserPokemon without required fields", async () => {
    const userPokemon = new UserPokemon({
      userId: "user123",
      addedAt: new Date(),
    });
    let error;
    try {
      await userPokemon.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.errors.pokemonsID).toBeDefined();
  });
});
