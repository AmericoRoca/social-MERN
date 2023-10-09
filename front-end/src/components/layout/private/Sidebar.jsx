import React, { useState } from "react";
import avatar from "../../../assets/img/user.png";
import useAuth from "../../../hooks/useAuth";
import { Global } from "../../../helpers/Global";
import { Link } from "react-router-dom";
import {useForm} from "../../../hooks/useForm"

export const Sidebar = () => {
  const { auth, counters } = useAuth();

  const { form, changed } = useForm({});

  const [stored, setStored] = useState("not_stored");

  const savePublication = async (e) => {
    e.preventDefault();

    //Recoger datos formulario
    let newPublication = form;
    newPublication.user = auth._id;

    //Hacer request para guardar bd
    const request = await fetch(Global.url + "publication/save", {
      method: "POST",
      body: JSON.stringify(newPublication),
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    //Exito o error

    if (data.status === "Success") {
      setStored("stored");
    } else {
      setStored("error");
    }

    //Subir imagen
    const fileInput = document.querySelector("#file");

    if(data.status === "Success" && fileInput.files[0]){
        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        const uploadRequest = await fetch(Global.url+"publication/upload/"+data.publicationStored._id,{
            method: "POST",
            body: formData,
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })

        const uploadData = await uploadRequest.json();

        if(uploadData.status === "Success"){
            setStored("stored")
        } else {
            setStored("error")
        }

        if(data.status === "Success" && uploadData.status == "Success"){
            const myForm = document.querySelector("#publication-form");
            myForm.reset();

        } else {
            setStored("error")
        }

    }

  };

  return (
    <aside className="layout__aside">
      <header className="aside__header">
        <h1 className="aside__title">Hola, {auth.name}</h1>
      </header>

      <div className="aside__container">
        <div className="aside__profile-info">
          <div className="profile-info__general-info">
            <div className="general-info__container-avatar">
              {auth.image != "default.png" && (
                <img
                  src={Global.url + "user/getAvatar/" + auth.image}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
              )}
              {auth.image == "default.png" && (
                <img
                  src={avatar}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
              )}
            </div>

            <div className="general-info__container-names">
              <Link to={"/social/profile/"+auth._id} className="container-names__name">
                {auth.name} {auth.surname}
              </Link>
              <p className="container-names__nickname">{auth.username}</p>
            </div>
          </div>

          <div className="profile-info__stats">
            <div className="stats__following">
              <Link to={"following/" + auth._id} className="following__link">
                <span className="following__title">Siguiendo</span>
                <span className="following__number">{counters.following}</span>
              </Link>
            </div>
            <div className="stats__following">
              <Link to={"followers/"+auth._id} className="following__link">
                <span className="following__title">Seguidores</span>
                <span className="following__number">{counters.followed}</span>
              </Link>
            </div>

            <div className="stats__following">
              <Link to={"/social/profile/"+auth._id} className="following__link">
                <span className="following__title">Publicaciones</span>
                <span className="following__number">
                  {counters.publications}
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="aside__container-form">
          {stored == "stored" ? (
            <strong className="alert alert-success">
              {" "}
              "Publicado correctamente !!"
            </strong>
          ) : (
            ""
          )}
          {stored == "error" ? (
            <strong className="alert alert-danger">
              {" "}
              "Error en la publicación !!"
            </strong>
          ) : (
            ""
          )}

          <form
            className="container-form__form-post"
            onSubmit={savePublication}
            id="publication-form"
          >
            <div className="form-post__inputs">
              <label htmlFor="text" className="form-post__label">
                ¿Que estas pesando hoy?
              </label>
              <textarea
                name="text"
                className="form-post__textarea"
                onChange={changed}
              />
            </div>

            <div className="form-post__inputs">
              <label htmlFor="file" className="form-post__label">
                Sube tu foto
              </label>
              <input
                type="file"
                name="file"
                className="form-post__image"
                id="file"
              />
            </div>

            <input
              type="submit"
              value="Enviar"
              className="form-post__btn-submit"
            />
          </form>
        </div>
      </div>
    </aside>
  );
};
