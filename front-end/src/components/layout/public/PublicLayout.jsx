import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../public/Header'

export const PublicLayout = () => {
  return (
    <>
    {/*LAYOUT*/}
    <Header/>

    {/*CONTENIDO PRINCIPAL*/}
    <section className='layout__content'>
        <Outlet/>

    </section>
  
    </>
  )
}