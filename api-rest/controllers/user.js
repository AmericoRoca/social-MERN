//importar dependencias y modulos
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const mongoosePagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");
const followService = require("../services/followUserIds")
const Publication = require("../models/Publication")
const Follow = require("../models/Follow")

//test actions
const test = (req, res) => {
  return res
    .status(200)
    .send({ message: "Message send from controller: user", user: req.user });
};

const register = async (req, res) => {
  //recoger valores a guardar

  let params = req.body;

  //comprobar que llegan

  if (!params.name || !params.email || !params.password || !params.username || !params.surname) {
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
    })
    .exec();

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

const profile = async (req,res) =>{

  try {
     //Get the id params of user form url
    let id = req.params.id;

    //Query to get data user
    const user = await User.findById(id)
      .select({password: 0, role: 0});

    if(!user){
      res.status(404).send({
        message: "User doesn't exists",
        status: "Error",
        user
      });
    }

    //info de seguimiento
    const follow_info = await followService.followThisUser(req.user.id, id);

    //Return result
    res.status(200).send({
      message: "User exits!!",
      status: "Success",
      user,
      following: follow_info.following,
      follower: follow_info.followers
    });

  } catch (error) {
    res.status(404).send({
      message: "User doesn't exists",
      status: "Error"
    });
  }
 
}

const list = async (req, res) => {
  try {
    // Obtener el número de página de la consulta
    let page = 1;
    if (req.params.page) {
      page = parseInt(req.params.page);
    }

    console.log('Page:', page);

    // Número de resultados por página
    let items_per_page = 3;
    if (req.query.items_per_page) {
      items_per_page = parseInt(req.query.items_per_page);
    }

    // Calcular el número de documentos a omitir en la consulta
    const skipDocuments = (page - 1) * items_per_page;

    // Consulta con paginación utilizando skip() y limit()
    const result = await User.find().sort('_id').skip(skipDocuments).limit(items_per_page);
    const totalUsers = await User.countDocuments();

    if (!totalUsers) {
      return res.status(500).send({
        message: 'Error in the database',
        status: 'Error',
      });
    }

    //info de seguimiento
    const followUserIds = await followService.followUserIds(req.user.id);

    res.status(200).send({
      message: 'Working',
      status: 'Success',
      page: page,
      items_per_page: items_per_page,
      total: totalUsers,
      users: result,
      pages: Math.ceil(totalUsers / items_per_page), // Calcular el número total de páginas
      following: followUserIds.following,
      follower: followUserIds.followers
    });

  } catch (error) {
    console.log(error)

    res.status(500).send({
      message: 'Error in the query',
      status: 'Error',
    });
  }
};

const updateUser = async (req, res) => {
  try {
    //Get the info to the updated user
    const userIdentity = req.user;
    const userToUpdate = req.body;

    //Remover leftover fields
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;

    //Check if the user already exists
    const users = await User.find({
      $or: [
        { email: userToUpdate.email.toLowerCase() },
        { username: userToUpdate.username.toLowerCase() },
      ],
    }).exec();

    let userIsset = false;

    users.forEach((user) => {
      if (user && user._id.toString() !== userIdentity.id) {
        userIsset = true;
      }
    });

    if (userIsset) {
      return res.status(200).send({
        status: "Success",
        message: "User already exists",
      });
    }

    //Crypt password
    if (userToUpdate.password) {
      const hashedPassword = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = hashedPassword;

    } else {

      delete userToUpdate.password;
    }

    // Find and update the user in the database
    await User.findByIdAndUpdate(userIdentity.id, userToUpdate);

    res.status(200).send({
      message: "Working",
      status: "Success",
      userToUpdate,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error in the query",
      status: "Error",
    });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    // Get file image and check if it exists
    if (!req.file) {
      return res.status(400).send({
        message: "Request doesn't include the image",
        status: "Error",
      });
      
    }

    // Get file name
    const image = req.file.originalname;

    // Extract ext of the file
    const imageSplit = image.split(".");
    const ext = imageSplit[imageSplit.length - 1].toLowerCase(); // Convert the extension to lowercase

    // Check ext
    if (ext !== "png" && ext !== "jpeg" && ext !== "jpg" && ext !== "gif") {
      const filePath = req.file.path;
      await fs.unlinkSync(filePath); // Delete the file
      res.status(400).send({
        message: "File extension invalid",
        status: "Error",
      });
      
    }

    // Delete or save the file as per your requirement
    const userUpdated = await User.findByIdAndUpdate(req.user.id, {image: req.file.filename}, {new:true})

    if(!userUpdated){
      res.status(500).send({
        message: "Error in the avatar upload",
        status: "Error",
      });
    }

    return res.status(200).send({
      message: "Working subida de imagenes",
      status: "Success",
      file: req.file,
      user: userUpdated
    });

  } catch (error) {
    return  res.status(500).send({
      message: "Error in the query",
      status: "Error",
    });
  }
};

const getAvatar = (req,res) =>{

  try {
    //Get the param from url
    const file = req.params.file;

    //Build a path for the image
    const filePath = "./uploads/avatars/"+file;


    //Check if the file exists
    fs.stat(filePath, (err, exists) =>{

      if(err){

        res.status(404).send({
          message: "Image doesn't exists",
          status: "Error"
        });
      }

      
      //Return file
      return res.sendFile(path.resolve(filePath));


    })


  } catch (error) {
    return res.status(500).send({
      message: "Error in the query",
      status: "Error",
    });
  }

}

const counters = async(req,res) =>{

  let userId = req.user.id;

  if(req.params.id){
    userId = req.params.id;
  }

  try {

    const following = await Follow.count({"user": userId});

    const followed = await Follow.count({"followed": userId});

    const publications = await Publication.count({"user": userId});

    return res.status(200).send({
      userId,
      following: following,
      followed: followed,
      publications: publications
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      status: "error",
      message: "Error en los contadores",
      error
    })
  }

}

module.exports = {
  test,
  register,
  login,
  profile,
  list,
  updateUser,
  uploadAvatar,
  getAvatar,
  counters
};
