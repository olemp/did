import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const Header = () => (
  <div className="header">
    <div className="text">Did 365</div>
    <div className="nav-bar">
      <Link className="router-link" to="/">Home</Link>
      <Link className="router-link" to="/week_view">Week</Link>
      <Link className="router-link" to="/customers">Customers</Link>
      <Link className="router-link" to="/projects">Projects</Link>
      <a className="router-link" href="/auth/signin">Sign in</a>
    </div>
  </div>
);

export default Header;
