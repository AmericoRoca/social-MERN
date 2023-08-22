import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../private/Header'
import { Sidebar } from '../private/Sidebar'

export const PrivateLayout = () => {
  return (
    <>
    {/*LAYOUT*/}
    <Header/>

    {/*CONTENIDO PRINCIPAL*/}
    <section className='layout__content'>
        <Outlet/>

    </section>
    

     {/*BARRA LATERAL*/}
     <Sidebar/>

    </>
  )
}
