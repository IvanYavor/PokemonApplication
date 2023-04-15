const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");

const app = require("../../index.js");
const Pokemon = require("../../models/pokemon");

let mongoServer;
beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("createPokemons", () => {
  it("should return 400 if no body or empty pokemons array provided", async () => {
    const response = await request(app).post("/pokemons").send({});
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if invalid pokemon provided", async () => {
    const response = await request(app)
      .post("/pokemons")
      .send({ pokemons: [{ name: "invalid pokemon" }] });
    expect(response.statusCode).toBe(400);
  });

  it("should create multiple pokemons and return 201 status", async () => {
    const response = await request(app)
      .post("/pokemons")
      .send({
        pokemons: [
          { name: "Bulbasaur", type: "Grass", level: 1 },
          { name: "Charmander", type: "Fire", level: 1 },
          { name: "Squirtle", type: "Water", level: 1 },
        ],
      });
    expect(response.statusCode).toBe(201);
  });
});

describe("getPokemons", () => {
  it("should return all pokemons", async () => {
    await Pokemon.insertMany([
      { name: "Bulbasaur", type: "Grass", level: 1 },
      { name: "Charmander", type: "Fire", level: 1 },
      { name: "Squirtle", type: "Water", level: 1 },
    ]);
    const response = await request(app).get("/pokemons");
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(3);
  });

  it("should return 404 if no pokemons found", async () => {
    const response = await request(app).get("/pokemons");
    expect(response.statusCode).toBe(404);
  });
});

describe("getPokemonById", () => {
  it("should return 400 if invalid id provided", async () => {
    const response = await request(app).get("/pokemons/invalid-id");
    expect(response.statusCode).toBe(400);
  });

  it("should return pokemon by id", async () => {
    const pokemon = await new Pokemon({
      name: "Bulbasaur",
      type: "Grass",
      level: 1,
    }).save();
    const response = await request(app).get(`/pokemons/${pokemon.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.name).toBe("Bulbasaur");
  });

  it("should return 404 if pokemon not found", async () => {
    const response = await request(app).get(
      `/pokemons/${mongoose.Types.ObjectId()}`
    );
    expect(response.statusCode).toBe(404);
  });
});
