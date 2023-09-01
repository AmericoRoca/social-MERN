import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth';

export const Logout = () => {

    const navigate = useNavigate();
    const { setAuth, setCounters} = useAuth();

    useEffect(()=>{
        //Vaciar el localstorage
        localStorage.clear();


        //Set global states to empty
        setAuth({});
        setCounters({});


        //Navigate to login
        navigate("/login");
    })


  return (
    <h1>Cerrando sesión...</h1>
  )
}
