import React from 'react';
import logo from '../assets/telecomAragua.jpg';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <img src={logo} alt="Logo Telecom Aragua" className="header-logo" />
        <h1 className="header-title">Sistema de gestión de radios</h1>
      </div>
    </header>
  );
};

export default Header;
