import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router for navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import the FontAwesome icon you want to use
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar navbar-light navbar-expand-lg bg-body-tertiary w-100 mt-0" id="myNavbar">
      <div>
        <Link className="navbar-brand" data-cy="logo" to="/main">
          <img src="../../content/images/burger.webp" alt="Logo" width="70" height="65" className="d-inline-block align-text-center me-2" />
          Great Burgers
        </Link>
      </div>
      <div className="container-fluid justify-content-start">
        <span className="navbar-text">Serving quality since 1989</span>
      </div>
      <div className="container-fluid justify-content-end me-5">
        <Link to="/" className="btn ms-3" id="goBackButton" data-cy="goBackButton">
          <FontAwesomeIcon icon={faArrowLeft} width={20} height={20} className="me-1" />
        </Link>
      </div>
    </nav>
  );
}
