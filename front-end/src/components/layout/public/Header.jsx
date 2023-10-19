import React from 'react'
import { Nav } from './Nav'
import { Link } from 'react-router-dom'
import avatar from '../../../assets/img/MERN-SOCIAL.png'

export const Header = () => {
  return (
    <header className="layout__navbar">

    <div className="navbar__header">
      <Link to="/login" className="navbar__title"><img src={avatar} alt="" className='image-header'/></Link>
    </div>

    <Nav/>

  </header>
  )
}
