import axios from "axios";

const api = axios.create({
  // TODO use env; won't work in heroku
  baseURL: "https://pokemon-application-api.vercel.app",
});

export const addUserPokemon = (payload) =>
  api.post(`user-pokemons/add`, payload);
export const getPokemons = () => api.get(`pokemons`, {});
export const getUserPokemons = (payload) =>
  api.get(`user-pokemons/${payload.userId}`, {});
export const evolveUserPokemon = (payload) =>
  api.post(`user-pokemons/evolve`, payload);

const apis = {
  addUserPokemon,
  getPokemons,
  getUserPokemons,
  evolveUserPokemon,
};

export default apis;
