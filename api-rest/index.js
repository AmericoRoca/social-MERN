//import dependencies
const { connection } = require("../api-rest/database/connection");
const express = require("express");
const cors = require("cors");


//Welcome message
console.log("API NODE WORKING!!")

//Database connection
connection();


//Node server
const app = express();
const port = 3900;


//Configure CORS
app.use(cors());


//Convert body objects to js
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Upload routes
const userRoutes = require("./routes/user");
const publicationRoutes = require("./routes/publication");
const followRoutes = require("./routes/follow");


app.use("/api/user", userRoutes)
app.use("/api/publication", publicationRoutes)
app.use("/api/follow", followRoutes)


//test route
app.get("/test", (req,res) =>{
    return res.status(200).json({
        "id": 1,
        "nombre": "Americo"
    })
})


//Listening port
app.listen(port, () =>{
    console.log("Server running on port: http://localhost:"+port+"/api")
})
