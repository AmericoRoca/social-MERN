import React, { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import { useParams } from "react-router-dom";
import { People } from "../user/People";

export const Following = () => {

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const params = useParams();

  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (nextPage = 1) => {
    //Efecto de carga
    setLoading(true);

    //Sacar userId de la url
    const userId = params.userId;

    //Peticion sacar usuarios
    const request = await fetch(Global.url + "follow/following/"+userId+"/"+nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    let cleanUsers = [];

    //Recorrer y limpiar follows para quedarme con followed
    data.follows.forEach(follow => {
      cleanUsers = [...cleanUsers, follow.followed]
    });
    
    data.users = cleanUsers;


    //Crear estado para poder listarlos
    if (data.users && data.status == "Success") {
      let newUsers = data.users;

      if (users.length >= 1) {
        newUsers = [...users, ...data.users];
      }

      setUsers(newUsers);
      setFollowing(data.following);
      setLoading(false);

      //Paginacion
      if (users.length >= data.total - data.users.length) {
        setMore(false);
      }
    }
  };


  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Usuarios que sigue: </h1>
      </header>

      <People/>

      
    </>
  );
};
