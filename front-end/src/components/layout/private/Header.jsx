import React from 'react'
import { Nav } from './Nav'
import avatar from '../../../assets/img/MERN-SOCIAL.png'

export const Header = () => {
  return (
    <header className="layout__navbar">

    <div className="navbar__header">
      <a href="#" className="navbar__title">
        <img src={avatar} alt="" className='image-header'/>
      </a>
    </div>

    <Nav/>

  </header>
  )
}
