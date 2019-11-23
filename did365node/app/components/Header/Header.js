import React from 'react';
import { Link } from 'react-router-dom';
import Banner from './images/banner.jpg';
import './style.scss';

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <div className="text">
          Did 365
        </div>
        <div className="nav-bar">
          <Link className="router-link" to="/">
            Home
          </Link>
          <Link className="router-link" to="/week_view">
            Week
          </Link>
          <Link className="router-link" to="/customers">
            Customers
          </Link>
          <Link className="router-link" to="/projects">
            Projects
          </Link>
        </div>
      </div>
    );
  }
}

export default Header;
