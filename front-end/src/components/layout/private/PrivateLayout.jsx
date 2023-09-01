import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Header } from "../private/Header";
import { Sidebar } from "../private/Sidebar";
import useAuth from "../../../hooks/useAuth";

export const PrivateLayout = () => {
  const { auth, loading } = useAuth();

  if (loading) {
    return (
      <div id="contenedor-cargando">
        <div className="contenedor-loader">
          <div className="rueda"></div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        {/*LAYOUT*/}
        <Header />

        {/*CONTENIDO PRINCIPAL*/}
        <section className="layout__content">
          {auth._id ? <Outlet /> : <Navigate to="/login" />}
        </section>

        {/*BARRA LATERAL*/}
        <Sidebar />
      </>
    );
  }
};
