import React from 'react'
import avatar from '../../../assets/img/user.png'
import { NavLink } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { Global } from '../../../helpers/Global'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faHouse } from '@fortawesome/free-solid-svg-icons'
import { faList } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'

export const Nav = () => {

    const {auth} = useAuth();

    

  return (

    <nav className="navbar__container-lists">

        <ul className="container-lists__menu-list">
            <li className="menu-list__item">
                <NavLink to="/social" className="menu-list__link">
                    <FontAwesomeIcon icon={faHouse} />
                    <span className="menu-list__title">Inicio</span>
                </NavLink>
            </li>

            <li className="menu-list__item">
                <NavLink to="/social/feed" className="menu-list__link">
                    <FontAwesomeIcon icon={faList} />
                    <span className="menu-list__title">Timeline</span>
                </NavLink>
            </li>

            <li className="menu-list__item">
                <NavLink to="/social/people" className="menu-list__link">
                    <FontAwesomeIcon icon={faUser} />
                    <span className="menu-list__title">Gente</span>
                </NavLink>
            </li>


        </ul>

        <ul className="container-lists__list-end">
            <li className="list-end__item">
                <NavLink to={"/social/profile/"+auth._id} className="list-end__link-image">
                {auth.image != "default.png" && <img src={Global.url+"user/getAvatar/"+auth.image} className="list-end__img" alt="Foto de perfil"/>} 
                {auth.image == "default.png" && <img src={avatar} className="list-end__img" alt="Foto de perfil"/>}  
                </NavLink>
            </li>
            <li className="list-end__item">
                <NavLink to={"/social/profile/"+auth._id} className="list-end__link">
                    <span className="list-end__name">{auth.username}</span>
                </NavLink>
            </li>
            <li className="list-end__item">
                <NavLink to="/social/config" className="list-end__link">
                    <FontAwesomeIcon icon={faGear} />
                    <span className="list-end__name">Ajustes</span>
                </NavLink>
            </li>
            <li className="list-end__item">
                <NavLink to="/social/logout" className="list-end__link">
                    <span className="list-end__name">Cerrar sesion</span>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </NavLink>
            </li>
        </ul>

    </nav>
  )
}
