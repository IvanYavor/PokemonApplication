import React from "react";
import PropTypes from "prop-types";
import "./styles/Modal.scss";

function Modal({ pokemon, onClose, onAddToList, onEvolve, userPokemons }) {
  console.log({ pokemonInModal: pokemon });

  return (
    <div className="modal">
      <div className="modal__content">
        <img src={pokemon.imageUrl} alt={pokemon.name} className="modal__image" />
        <div className="modal__info">
          <div className="modal__name">{pokemon.name}</div>
          <div className="modal__level">Level: {pokemon.level}</div>
          <div className="modal__type">Type: {pokemon.type}</div>
          <div className="modal__abilities">Abilities: {pokemon.abilities.join(", ")}</div>
          {userPokemons ? (
            <button className="modal__button" onClick={onEvolve}>
              Evolve
            </button>
          ) : (<button className="modal__button" onClick={onAddToList}>
            Add to my list
          </button>)}
        </div>
        <button className="modal__close" onClick={onClose}>
          X
        </button>
      </div>
    </div >
  );
}

Modal.propTypes = {
  pokemon: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onAddToList: PropTypes.func.isRequired,
};

export default Modal;