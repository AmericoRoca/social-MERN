//import dependencies
const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");


//Welcome message
console.log("API NODE WORKING!!")

//Database connection
connection();


//Node server
const app = express();
const port = process.env.PORT || 3000;


//Configure CORS
app.use(cors());


//Convert body objects to js
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Upload routes
const userRoutes = require("./routes/user");
const publicationRoutes = require("./routes/publication");
const followRoutes = require("./routes/follow");


app.use("/user", userRoutes)
app.use("/publication", publicationRoutes)
app.use("/follow", followRoutes)


//test route
app.get("/test", (req,res) =>{
    return res.status(200).json({
        "id": 1,
        "nombre": "Americo"
    })
})


//Listening port
app.listen(port, () =>{
    console.log("Server running on port: http://localhost:"+port)
})
