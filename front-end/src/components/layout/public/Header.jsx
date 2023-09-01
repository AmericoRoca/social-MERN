import React from 'react'
import { Nav } from './Nav'
import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <header className="layout__navbar">

    <div className="navbar__header">
      <Link to="/login" className="navbar__title">ReactSocial</Link>
    </div>

    <Nav/>

  </header>
  )
}
