import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import List from "./components/List";
import Navbar from "./components/Navbar";

import apis from "./api";
import getUserAccount from "./utils/getUserAccount";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [userPokemons, setUserPokemons] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { address: userIdData } = await getUserAccount();
      setUserId(userIdData);

      // get pokemons
      const pokemonsResponse = await apis.getPokemons();
      const pokemonsData = pokemonsResponse?.data?.data || [];
      setPokemons(pokemonsData);

      // get userPokemons
      const userPokemonsResponse = await apis.getUserPokemons({
        userId: userIdData,
      });
      const userPokemonsData = userPokemonsResponse?.data?.data || [];
      const userPokemonsIds = userPokemonsData.map(
        ({ pokemonsID }) => pokemonsID
      );
      const filterUserPokemons = pokemonsData.filter((pokemon) => {
        return userPokemonsIds.includes(pokemon.id);
      });
      setUserPokemons(filterUserPokemons);
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <List pokemons={pokemons} setUserPokemons={setUserPokemons} />
            )}
          />
          <Route
            render={(props) => (
              <List
                pokemons={userPokemons}
                setUserPokemons={setUserPokemons}
                userPokemons={true}
              />
            )}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
