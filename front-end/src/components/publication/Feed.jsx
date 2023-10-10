import React from "react";
import { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faTrashCan } from '@fortawesome/free-solid-svg-icons'


export const Feed = () => {


  const { auth } = useAuth();
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  const params = useParams();

  useEffect(() => {
    getPublications(1, true);
  }, []);

  const getPublications = async (nextPage = 1) => {
    const request = await fetch(
      Global.url + "publication/feed/"+ nextPage,
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


      setPublications(newPublications);

    

      if (publications.length >= data.totalPublications - data.publications.length) {
        setMore(false);
      }

      if(data.pages <= 1){
        setMore(false);
      }

    }
  };


  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Timeline</h1>
        <button className="content__button">Mostrar nuevas</button>
      </header>

    
      <div className="content__container-btn">
        <button className="content__btn-more-post">Ver mas publicaciones</button>
      </div>
    </>
  );
};
