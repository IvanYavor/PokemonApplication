import React from 'react';
import { Link } from 'react-router-dom';
import "./styles/Navbar.scss"

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar__list">
        <li className="navbar__item"><Link to="/" className="navbar__link">Pokemon List</Link></li>
        <li className="navbar__item"><Link to="/my-pokemons" className="navbar__link">My Pokemons</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;