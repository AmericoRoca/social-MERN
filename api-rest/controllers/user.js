//importar dependencias y modulos
const User = require("../models/User")
const bcrypt = require("bcrypt")
const { use } = require("../routes/user")


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
            status: "Error",
            params
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

    
    //Cifrar la contraseña

    try {

        const hashedPassword = await bcrypt.hash(user_to_save.password, 10);
        user_to_save.password = hashedPassword;

    } catch (error) {

        return res.status(500).json({
            status: "Error",
            message: "Error in hashing the password",
        });
    }


    try {

        const savedUser = await user_to_save.save();

        return res.status(200).send({
              message: "Register working",
              status: "Success",
              user_to_save: savedUser,
        });

    } catch (error) {

        return res.status(500).json({
              status: "Error",
              message: "Error in saving the user",
        });

    }
        

}


module.exports = {
    test,
    register
}