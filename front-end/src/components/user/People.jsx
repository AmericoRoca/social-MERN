import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import useAuth from '../../hooks/useAuth';

export const People = () => {

  const {auth} = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true)
  const [loading, setLoading] = useState(true)
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

  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getUsers(next);
    
  }

  const follow = async(userId) =>{
       //peticion al backend para guardar el follow
       const request = await fetch(Global.url+"follow/save",{
        method: "POST",
        body: JSON.stringify({followed: userId}),
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token")
        }
      })
  
      const data = await request.json();
  
      //Cuando este todo correcto
  
      if(data.status == "Success"){
  
          //Actualizar estado following, filtrando datos para eliminar follow
          setFollowing([...following, userId])
      }

  }

  const unFollow = async(userId) =>{

    //peticion al backend para guardar el follow
    const request = await fetch(Global.url+"follow/unfollow/"+userId,{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      }
    })

    const data = await request.json();

    //Cuando este todo correcto

    if(data.status == "Success"){

        //Actualizar estado following, filtrando datos para eliminar follow
        let filterFollowings = following.filter(followingUserId => userId !== followingUserId);

        setFollowing(filterFollowings);
    }

  
    
  }

  return (
    <>
      <header className="content__header">

      <div className="content__posts">

        {loading ? "Cargando..." : ""}

        {users.map((user) => {
          return (
            <>
            <article className="posts__post" key={user._id}>
              <div className="post__container">
                <div className="post__image-user">
                  <a href="#" className="post__image-link">
                    {user.image != "default.png" && (
                      <img
                        src={Global.url + "user/getAvatar/" + user.image}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                    {user.image == "default.png" && (
                      <img
                        src={avatar}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                  </a>
                </div>

                <div className="post__body">
                  <div className="post__user-info">
                    <a href="#" className="user-info__name">
                      {user.name}
                      {user.surname}
                    </a>
                    <span className="user-info__divider"> | </span>
                    <a href="#" className="user-info__create-date">
                      {user.created_at}
                    </a>
                  </div>

                  <h4 className="post__content">{user.bio}</h4>
                </div>
              </div>
              
            {user._id != auth._id &&
            <div className="post__buttons">

              {!following.includes(user._id) &&
                  <button className="post__button post__button--green"
                    onClick={() => follow(user._id)}>
                    Seguir
                  </button>
              }
                {following.includes(user._id) &&
                  <button className="post__button post__button"
                  onClick={() => unFollow(user._id)}>
                  Dejar de seguir
                  </button>
                }
              </div>
        }
            </article>
            </>
          );
        
        })}
        </div>    
      </header>
        {more &&
      <div className="content__container-btn">
        <button className="content__btn-more-post" onClick={nextPage}>
          Ver mas publicaciones
        </button>
      </div>
      }
    </>
  );
};
