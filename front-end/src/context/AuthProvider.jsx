import React from "react";
import { useState, useEffect, createContext } from "react";
import { Global } from "../helpers/Global";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState({});
  const [counters, setCounters] = useState({});

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


    //peticion contadores
    const requestCounters = await fetch(Global.url + "user/profile/" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const dataCounters = await requestCounters.json();

    setAuth(data.user);
    setCounters(dataCounters);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, counters }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
