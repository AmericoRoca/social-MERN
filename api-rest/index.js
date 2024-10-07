// Importar dependencias
const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/user");  // Asegúrate de tener el modelo de usuario

// Mensaje de bienvenida
console.log("API NODE WORKING!!");

// Conexión a la base de datos
connection();

// Crear servidor Node
const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS
app.use(cors());

// Convertir objetos del cuerpo a js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de carga
const userRoutes = require("./routes/user");
const publicationRoutes = require("./routes/publication");
const followRoutes = require("./routes/follow");

app.use("/user", userRoutes);
app.use("/publication", publicationRoutes);
app.use("/follow", followRoutes);

// Ruta de prueba
app.get("/test", (req, res) => {
  return res.status(200).json({
    id: 1,
    nombre: "Americo",
  });
});

// Escuchar el puerto
const server = app.listen(port, () => {
  console.log("Server running on port: http://localhost:" + port);
});

