import React, { useState } from "react";
import PropTypes from "prop-types";
import "./styles/List.scss";
import Card from "./Card";
import Modal from "./Modal";
import signMessage from "../utils/signMessage"
import apis from "../api/index";

function List({ pokemons, setUserPokemons, userPokemons = false }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const handleCardClick = (pokemon) => {
    if (!userPokemons) {
      setUserPokemons((prevState) => [...prevState, pokemon])
    }
    setSelectedPokemon(pokemon);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPokemon(null);
    setModalOpen(false);
  };

  const randomPokemon = (pokemons, excludedPokemon) => {
    let randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
    while (randomPokemon === excludedPokemon) {
      randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
    }

    return randomPokemon;
  }

  const handleEvolve = async (e) => {
    e.preventDefault();

    const pokemonTo = randomPokemon(pokemons, selectedPokemon);
    const { signature: signedMessage } = await signMessage(`I want evolve ${selectedPokemon.name} to ${pokemonTo.name}`);
    await apis.evolveUserPokemon({ signedMessage, userPokemonsIDFrom: selectedPokemon.id, userPokemonsIDto: pokemonTo.id });

    console.log("Closing modal in handleEvolve");
    handleCloseModal();
  }

  const handleAddToMyList = async (e) => {
    e.preventDefault();

    const { signature: signedMessage } = await signMessage(`I want add ${selectedPokemon.name} to my list`);
    await apis.addUserPokemon({ signedMessage, pokemonsID: selectedPokemon.id });

    console.log("Closing modal in handleAddToMyList");
    handleCloseModal();
  }

  return (
    <div className="list">

      {pokemons.map((pokemon) => {
        return (<Card
          key={pokemon.id}
          image={pokemon.imageUrl}
          name={pokemon.name}
          level={pokemon.level}
          type={pokemon.type}
          onClick={() => handleCardClick(pokemon)}
        />)
      }

      )}

      {modalOpen && (
        <Modal
          pokemon={selectedPokemon}
          userPokemons={userPokemons}
          onClose={handleCloseModal}
          onAddToList={handleAddToMyList}
          onEvolve={handleEvolve}
        />
      )}
    </div >
  );
}

List.propTypes = {
  pokemons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      level: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default List;