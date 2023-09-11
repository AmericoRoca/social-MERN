import React, { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import { UserList } from "./UserList";

export const People = () => {


  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true)
  const [more, setMore] = useState(true)
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (nextPage = 1) => {
    //hacer peticion
    const request = await fetch(Global.url + "user/list/"+nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    

    //crear estado para listar
    if (data.users && data.status == "Success") {

      let newUsers = data.users;

      if(users.length >= 1){
        newUsers = [...users, ...data.users];
      }
       
      setUsers(newUsers);
      setFollowing(data.following)
      setLoading(false);

      if(users.length >= (data.total - data.users.length)){
        setMore(false);
      }

    }

    //hacer paginacion
  };



  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Gente</h1>
      </header>

      <UserList users={users} 
                getUsers={getUsers} 
                following={following}
                setFollowing={setFollowing}
                loading={loading}
                more={more}
                page={page}
                setPage={setPage}
        />
    </>
  );
};
