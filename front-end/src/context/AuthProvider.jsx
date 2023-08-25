import React from "react";
import { useState, useEffect, createContext } from "react";
import { Global } from "../helpers/Global";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    authUser();
  }, []);

  const authUser = async () => {
    //Sacar datos del usuario identificado del local
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    //comprobar si tengo el token y el user
    if (!token || !user) {
      return false;
    }

    //transformar los datos en json
    const userObj = JSON.parse(user);
    const userId = userObj.id;

    //ajax
    const request = await fetch(Global.url + "user/profile/" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await request.json();

    setAuth(data.user);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
