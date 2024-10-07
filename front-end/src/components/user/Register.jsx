import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Global } from "../../helpers/Global";

export const Register = () => {

  const [auth, setAuth] = useState();
  const { form, changed } = useForm({});
  const [ saved, setSaved ] = useState("not_sended");

  const saveUser = async (e) => {
    //prevenir actualizacion de pantalla
    e.preventDefault();

    //recoger datos formulario
    let newUser = form;

    //guardar usuario en el back
    const request = await fetch(Global.url+"user/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();

    if(data.status == "Success"){

      //delete data.user.password;

      setAuth(data.user);
      setSaved("saved");
      
      //redireccion
      setTimeout(()=>{
        window.location.reload();
      }, 1000)

      window.location.href="/login";

    } else {
      setSaved("Error")
    }

  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Registro</h1>
      </header>

      <div className="content__posts">

        {saved == "saved" ? <strong className="alert alert-success"> "Usuario registrado correctamente !!"</strong> : ''}
        {saved == "error" ? <strong className="alert alert-danger"> "Usuario no registrado !!"</strong> : ''}
        <form action="" className="register-form" onSubmit={saveUser}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor="surname">Surname</label>
            <input type="text" name="surname" onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor="username">Nick</label>
            <input type="text" name="username" onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" onChange={changed} />
          </div>

          <input type="submit" value="Sign Up" className="btn btn-success" />
        </form>
      </div>
    </>
  );
};
