import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import { SerializeForm } from "../../helpers/SerializeForm";
import avatar from "../../assets/img/user.png"

export const Config = () => {

  
  const {auth, setAuth} = useAuth();

  const [saved, setSaved] = useState("not_saved");


  const updateUser = async(e) =>{
    e.preventDefault();

    //token auth
    const token = localStorage.getItem("token");


    //Recoger datos del formulario
    let newDataUser = SerializeForm(e.target);


    //Borrar propiedad innecesaria
    delete newDataUser.file;

    //Actualizar usuario en la base de datos
    const request = await fetch(Global.url+"user/update", {
      method: "PUT",
      body: JSON.stringify(newDataUser),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    const data = await request.json();


    if (data.status === "Success" && data.user) {

      setAuth(data.user);     
      setSaved("saved");

    } else {
      console.log("Entra a error");
      setSaved("error");
    }

    //Subida de imagenes
    const fileInput = document.querySelector("#file");

    if(data.status == "Success" && fileInput.files[0]){
      //recoger fichero a subir
      const formData = new FormData();

      formData.append("file", fileInput.files[0]);

      //Ajax
      const uploadRequest = await fetch(Global.url+"user/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization" : token
        }
      });

      const uploadData = await uploadRequest.json()

      if(uploadData.status == "Success" && uploadData.user){

        delete uploadData.user.password;
        setAuth(uploadData.user)
        setSaved("saved");

      } else {

        setSaved("error")
      }
    }
    
  }

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Settings</h1>
      </header>

      <div className="content__posts">
        {saved == "saved" ? (
          <strong className="alert alert-success">
            {" "}
            "Usuario actualizado correctamente !!"
          </strong>
        ) : (
          ""
        )}
        {saved == "error" ? (
          <strong className="alert alert-danger">
            {" "}
            "Usuario no actualizado !!"
          </strong>
        ) : (
          ""
        )}
        <form  className="config-form" onSubmit={updateUser}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" defaultValue={auth.name}/>
          </div>
          <div className="form-group">
            <label htmlFor="surname">Surname</label>
            <input type="text" name="surname" defaultValue={auth.surname}/>
          </div>
          <div className="form-group">
            <label htmlFor="username">Nick</label>
            <input type="text" name="username" defaultValue={auth.username}/>
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea name="bio" defaultValue={auth.bio}/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" defaultValue={auth.email}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" name="password"/>
          </div>
          <div className="form-group">
            <label htmlFor="file">Image</label>
            <div className="general-info__container-avatar">
                    {auth.image != "default.png" && <img src={Global.url+"user/getAvatar/"+auth.image} className="container-avatar__img" alt="Foto de perfil"/>} 
                    {auth.image == "default.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil"/>}      
            </div>
            <br />
            <input type="file" name="file" id="file"/>
          </div>
            <br />
          <input type="submit" value="Update" className="btn btn-success" />
        </form>
      </div>
    </>
  );
};
