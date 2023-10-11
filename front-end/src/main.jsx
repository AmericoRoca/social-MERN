//Importaciones obligatorias
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'


//importar assets
//import './assets/fonts/fontawesome-free-6.1.2-web'
import './assets/css/normalize.css'
import './assets/css/styles.css'
import './assets/css/responsive.css'

//Cargar configuracion React time ago
import TimeAgo from 'javascript-time-ago'

import es from "javascript-time-ago/locale/es.json";

TimeAgo.addDefaultLocale(es);
TimeAgo.addLocale(es);


//Arrancar app React
ReactDOM.createRoot(document.getElementById('root')).render(

    <App />

)
