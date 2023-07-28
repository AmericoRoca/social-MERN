//importar dependencias y modulos
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt")

//test actions
const test = (req, res) => {
  return res
    .status(200)
    .send({ message: "Message send from controller: user" });
};

const register = async (req, res) => {
  //recoger valores a guardar

  let params = req.body;

  //comprobar que llegan

  if (!params.name || !params.email || !params.password || !params.username) {
    return res.status(400).send({
      message: "Missing data",
      status: "Error",
      params,
    });
  }

  //Crear objeto de usuario

  let user_to_save = new User(params);

  //control usuarios duplicados

  try {
    const users = await User.find({
      $or: [
        { email: user_to_save.email.toLowerCase() },
        { username: user_to_save.username.toLowerCase() },
      ],
    }).exec();

    if (users && users.length >= 1) {
      return res.status(200).send({
        status: "Success",
        message: "User already exists",
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: "Error", message: "Error in the users request" });
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
};

const login = async(req, res) => {

  try {
    //Recoger parametros del body
    let params = req.body;

    if (!params.email || !params.password) {
      return res.status(400).send({
        message: "Missing data to send",
        status: "Error",
      });
    }

    //buscar si existe
    const user = await User.findOne({ email: params.email });

    // Comprobar si el usuario existe
    if (!user) {
      return res.status(404).send({
        message: "User doesn't exist",
        status: "Error",
      });
    }

    //comprobar contraseña
    const pwd = bcrypt.compareSync(params.password, user.password);

    if(!pwd){
        res.status(400).send({
            message: "Error in the identification",
            status: "Error"
        });
    }

    //Token
    const token = jwt.createToken(user);


    //Datos del usuario
    return res.status(200).send({
      message: "Login susccessfull",
      status: "Success",
      user:{
        id: user._id,
        name: user.name,
        username: user.username,
      },
      token
    });

  } catch (error) {
    res.status(404).send({
      message: "User doesn't exists",
      status: "Error",
    });
  }
};

module.exports = {
  test,
  register,
  login,
};
