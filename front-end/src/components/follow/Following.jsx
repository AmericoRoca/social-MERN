import React, { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import { UserList } from "../user/UserList";
import { useParams } from "react-router-dom";
import { GetProfile } from "../../helpers/getProfile";



export const Following = () => {
  
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [userProfile, setUserProfile] = useState({});

  const params = useParams();



  useEffect(() => {
    getUsers(1);
    GetProfile(params.userId, setUserProfile);
  }, []);

  const getUsers = async (nextPage = 1) => {
    const userId = params.userId;

    // Make a request
    const request = await fetch(Global.url + "follow/following/" + userId + "/" + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    let cleanUsers = [];

    // Loop through and clean follows to get followed users
    data.follows.forEach((follow) => {
      cleanUsers = [...cleanUsers, follow.followed];
    });

    data.users = cleanUsers;

    if (data.users && data.status === "Success") {
      let newUsers = data.users;

      if (users.length >= 1) {
        newUsers = [...users, ...data.users];
      }

      setUsers(newUsers);
      setFollowing(data.following);
      setLoading(false);

      if (newUsers.length >= data.total - data.users.length) {
        setMore(false);
      }
    }
  }


  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Usuarios que sigue: {userProfile.username}</h1>
      </header>

      <UserList
        users={users}
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
