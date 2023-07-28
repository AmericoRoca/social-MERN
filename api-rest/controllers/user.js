//importar dependencias y modulos
const User = require("../models/User")
const bcrypt = require("bcrypt")


//test actions
const test = (req,res) =>{
    return res.status(200).send({message: "Message send from controller: user"})
}

const register = async (req,res) => {

    //recoger valores a guardar 
    let params = req.body;

    //comprobar que llegan
    if(!params.name || !params.email || !params.password || !params.username){
        
        return res.status(400).send({
            message: "Missing data",
            status: "Error"
        });

    } 

    //Crear objeto de usuario
    let user_to_save = new User(params);
    

    //control usuarios duplicados
    try {
        const users = await User.find({
            $or: [
                { email: user_to_save.email.toLowerCase() },
                { username: user_to_save.username.toLowerCase() }
            ]
        }).exec();
    
        if (users && users.length >= 1) {
            return res.status(200).send({
                status: "Success",
                message: "User already exists"
            });
        } 
    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Error in the users request" });
    }

        //cifrar la contraseña

        

        //guardar usuario en la base de datos


        //devolver resultado



        return res.status(200).send({
            message: "Register working",
            status: "Success",
            user_to_save
        })

        
   
}


module.exports = {
    test,
    register
}