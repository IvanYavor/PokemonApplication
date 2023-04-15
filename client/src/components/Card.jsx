import React from "react";
import PropTypes from "prop-types";
import "./styles/Card.scss";
import "./Modal";

function Card({ image, name, level, type, onClick }) {

  return (
    <div className="card" onClick={onClick}>
      <img src={image} alt={name} className="card__image" />
      <div className="card__info">
        <div className="card__name">{name}</div>
        <div className="card__level">Level: {level}</div>
        <div className="card__type">Type: {type}</div>
      </div>
    </div>
  );
}

Card.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Card;