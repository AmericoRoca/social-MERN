import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import { Link, useParams } from "react-router-dom";
import { GetProfile } from "../../helpers/GetProfile";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import ReactTimeAgo from "react-time-ago";

export const PublicationList = ({
  publications,
  getPublications,
  page,
  setPage,
  more,
  setMore,
}) => {
  const { auth } = useAuth();

  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getPublications(next);
  };

  const deletePublication = async (publicationId) => {
    const request = await fetch(
      Global.url + "publication/delete/" + publicationId,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    const data = await request.json();

    setPage(1);
    setMore(true);
    getPublications(1, true);
  };

  return (
    <>
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
                      {publication.create_at && (
                        <ReactTimeAgo
                          date={publication.create_at}
                          locale="es-ES"
                        />
                      )}
                    </a>
                  </div>

                  <h4 className="post__content">{publication.text} </h4>

                  {publication.file && (
                    <img
                      src={Global.url + "publication/media/" + publication.file}
                    />
                  )}
                </div>
              </div>
              {auth._id == publication.user._id && (
                <div className="post__buttons">
                  <button
                    className="post__button button-trash"
                    onClick={() => deletePublication(publication._id)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {more && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={() => nextPage()}>
            Ver mas publicaciones
          </button>
        </div>
      )}
    </>
  );
};
