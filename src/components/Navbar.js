import React from 'react'
import { Link } from 'gatsby'
import github from '../img/github-icon.svg'
import logo from '../img/logo.svg'

const Navbar = () => (
  <nav className="navbar is-transparent">
    <div className="container">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          {/*<figure className="image">
          <img src={logo} alt="Kaldi" style={{ width: '88px' }} />
          </figure>*/}
          <h1 className="has-text-weight-bold is-size-3">t3db0t</h1>
        </Link>
      </div>
      <div className="navbar-start">
{/*        <Link className="navbar-item" to="/about">
          About
        </Link>
        <Link className="navbar-item" to="/products">
          Products
        </Link>*/}
      </div>
    </div>
  </nav>
)

export default Navbar
