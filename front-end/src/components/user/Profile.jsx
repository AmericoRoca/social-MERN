import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import { Link, useParams } from "react-router-dom";
import { GetProfile } from "../../helpers/getProfile";
import useAuth from "../../hooks/useAuth";


export const Profile = () => {

    const [user,setUser] = useState({});

    const params = useParams();

    const {auth, counters} = useAuth();

    useEffect(()=>{
      GetProfile(params.userId,setUser);
    })


  return (
    <>
    <br />
      <div className="aside__profile-info">
          <div className="profile-info__general-info">
            <div className="general-info__container-avatar">
              {user.image != "default.png" && (
                <img
                  src={Global.url + "user/getAvatar/" + user.image}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
              )}
              {user.image == "default.png" && (
                <img
                  src={avatar}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
              )}
            </div>

            <div className="general-info__container-names">
              <div className="container-names__name">
                <h1>{user.name} {user.surname}</h1>
              </div>
              <p className="container-names__nickname">{user.username}</p>
              <p>{user.bio}</p>
              <br />
              <button className="content__button">Seguir</button>
            </div>
          </div>

          <div className="profile-info__stats">
            <div className="stats__following">
              <div className="following__link">
                <span className="following__title">Siguiendo</span>
                <span className="following__number">{counters.following}</span>
              </div>
            </div>
            <div className="stats__following">
              <Link to={"seguidores/"+auth._id} className="following__link">
                <span className="following__title">Seguidores</span>
                <span className="following__number">{counters.followed}</span>
              </Link>
            </div>

            <div className="stats__following">
              <Link to={"/social/perfil/"+auth._id} className="following__link">
                <span className="following__title">Publicaciones</span>
                <span className="following__number">
                  {counters.publications}
                </span>
              </Link>
            </div>
          </div>
        </div>

      <div className="content__posts">
        <article className="posts__post">
          <div className="post__container">
            <div className="post__image-user">
              <a href="#" className="post__image-link">
                <img
                  src={avatar}
                  className="post__user-image"
                  alt="Foto de perfil"
                />
              </a>
            </div>

            <div className="post__body">
              <div className="post__user-info">
                <a href="#" className="user-info__name">
                  Victor Robles
                </a>
                <span className="user-info__divider"> | </span>
                <a href="#" className="user-info__create-date">
                  Hace 1 hora
                </a>
              </div>

              <h4 className="post__content">Hola, buenos dias.</h4>
            </div>
          </div>

          <div className="post__buttons">
            <a href="#" className="post__button">
              <i className="fa-solid fa-trash-can"></i>
            </a>
          </div>
        </article>
      </div>
      <div className="content__container-btn">
        <button className="content__btn-more-post">
          Ver mas publicaciones
        </button>
      </div>
    </>
  );
};
