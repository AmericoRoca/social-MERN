import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import { Link, useParams } from "react-router-dom";
import { GetProfile } from "../../helpers/GetProfile";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export const Profile = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState({});
  const [counters, setCounters] = useState({});
  const [iFollow, setIFollow] = useState(false);
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  const params = useParams();

  useEffect(() => {
    getDastaUser();
    getCounters();
    //getPublications(1, true);
  }, []);

  useEffect(() => {
    getDastaUser();
    getCounters();
    setMore(true);
    getPublications(1, true);
  }, [params]);

  const getDastaUser = async () => {
    let dataUser = await GetProfile(params.userId, setUser);
    if (dataUser.following) setIFollow(true);
  };

  const getCounters = async () => {
    const request = await fetch(Global.url + "user/counters/" + params.userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    if (data.following) {
      setCounters(data);
    }
  };

  const follow = async (userId) => {
    //peticion para guardar el follow
    const request = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    //actualizar el follow
    if (data.status == "Success") {
      setIFollow(true);
    }
  };

  const unfollow = async (userId) => {
    //peticion para guardar el follow
    const request = await fetch(Global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    //actualizar el follow
    if (data.status == "Success") {
      setIFollow(false);
    }
  };

  const getPublications = async (nextPage = 1, newProfile = false) => {
    const request = await fetch(
      Global.url + "publication/user/" + params.userId + "/" + nextPage,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        },
      }
    );

    const data = await request.json();

    if (data.status == "Success") {

      let newPublications = data.publications;

      if (!newProfile && publications.length >= 1) {
        newPublications = [...publications, ...data.publications];
      }


      if(newProfile){
        newPublications = data.publications;
        setMore(true);
        setPage(1);
      }

      setPublications(newPublications);

    

      if (!newProfile && publications.length >= data.totalPublications - data.publications.length) {
        setMore(false);
      }

    }
  };

  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getPublications(next);
  };

  const deletePublication = async() =>{
    const request = await fetch(Global.url+"publication/remove/"+publicationId, {
      method: "DELETE",
      headers:{
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    })
  }

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
              <h1>
                {user.name} {user.surname}
              </h1>

              {user._id != auth._id &&
                (iFollow ? (
                  <button
                    className="content__button content__button--rigth post__button"
                    onClick={() => unfollow(user._id)}
                  >
                    Dejar de seguir
                  </button>
                ) : (
                  <button
                    className="content__button content__button--rigth"
                    onClick={() => follow(user._id)}
                  >
                    Seguir
                  </button>
                ))}
            </div>
            <p className="container-names__nickname">{user.username}</p>
            <p>{user.bio}</p>
          </div>
        </div>

        <div className="profile-info__stats">
          <div className="stats__following">
            <Link
              to={"/social/siguiendo/" + user._id}
              className="following__link"
            >
              <span className="following__title">Siguiendo</span>
              <span className="following__number">
                {counters.following >= 1 ? counters.following : 0}
              </span>
            </Link>
          </div>
          <div className="stats__following">
            <Link
              to={"/social/seguidores/" + user._id}
              className="following__link"
            >
              <span className="following__title">Seguidores</span>
              <span className="following__number">
                {counters.followed >= 1 ? counters.followed : 0}
              </span>
            </Link>
          </div>

          <div className="stats__following">
            <Link to={"/social/perfil/" + user._id} className="following__link">
              <span className="following__title">Publicaciones</span>
              <span className="following__number">
                {counters.publications >= 1 ? counters.publications : 0}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="content__posts">
        {publications.map((publication) => {
          return (
            <article className="posts__post" key={publication._id}>
              <div className="post__container">
                <div className="post__image-user">
                  <Link
                    to={"/social/profile/" + publication.user._id}
                    className="post__image-link"
                  >
                    {publication.user.image != "default.png" && (
                      <img
                        src={
                          Global.url +
                          "user/getAvatar/" +
                          publication.user.image
                        }
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                    {publication.user.image == "default.png" && (
                      <img
                        src={avatar}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                  </Link>
                </div>

                <div className="post__body">
                  <div className="post__user-info">
                    <a href="#" className="user-info__name">
                      {publication.user.name + " " + publication.user.surname}
                    </a>
                    <span className="user-info__divider"> | </span>
                    <a href="#" className="user-info__create-date">
                      {publication.create_at}
                    </a>
                  </div>

                  <h4 className="post__content">{publication.text}</h4>
                </div>
              </div>
              {auth._id == publication.user._id && (
                <div className="post__buttons">
                  <a href="#" className="post__button">
                    <FontAwesomeIcon icon={faTrashCan} />
                  </a>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {more && 
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={() => nextPage()}>
            Ver mas publicaciones
          </button>
        </div>
      }
      <br />
    </>
  );
};
