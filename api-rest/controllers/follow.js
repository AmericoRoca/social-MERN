//Import dependencies
const Follow = require("../models/Follow")
const User = require("../models/User")
const mongoosePaginate = require("mongoose-pagination")


//import service
const followService = require("../services/followUserIds")



const save = async (req, res) => {
    try {
      const params = req.body;
      const identity = req.user;
  
      let userFollowed = new Follow({
        user: identity.id,
        followed: params.followed,
      });
  
      let followStored = await userFollowed.save();
  
      if (!followStored) {
        return res.status(500).send({
          message: "Error",
          status: "Impossible to follow",
        });
      }
  
      return res.status(200).send({
        message: "Success",
        status: "Success",
        identity: req.user,
        follow: followStored,
      });
    } catch (error) {

        return res.status(500).send({
          message: "An unexpected error occurred during the follow process.",
          status: "Error",
        });
    }
  };

  const unfollow = async (req, res) => {
    try {
        // Obtener el ID del usuario
        const id = req.user.id;

        // Obtener el ID del usuario seguido
        const followedId = req.params.id;

        // Ejecutar la eliminación
        const followDeleted = await Follow.findOneAndDelete({
            user: id,
            followed: followedId
        });

        if (!followDeleted) {
            return res.status(500).send({
                message: "Error deleting follow.",
                status: "Error",
            });
        }

        return res.status(200).send({
            message: "Successfully unfollowed.",
            status: "Success",
            identity: req.user,
            follow: followDeleted,
        });
    } catch (error) {
        return res.status(500).send({
            message: "An unexpected error occurred during the unfollow process.",
            status: "Error",
        });
    }
}

//(siguiendo)
const following = async (req, res) => {
  try {
      // Obtener el ID del usuario identificado
      let userId = req.user.id;

      // Verificar si el ID se está pasando por la URL
      if (req.params.id) userId = req.params.id;

      // Verificar si se está recibiendo el número de página, si no es así, usar la página 1
      let page = 1;
      if (req.params.page) {
          page = req.params.page;
      }

      // Usuarios por página
      const itemsPerPage = 5;

      // Encontrar el total de usuarios que sigue
      const totalFollows = await Follow.countDocuments({ user: userId });

      // Encontrar los usuarios que sigue y poblar los datos de los usuarios
      const follows = await Follow.find({ user: userId })
          .populate('followed', "-password -role -__v")
          .skip((page - 1) * itemsPerPage)
          .limit(itemsPerPage)
          .exec();

      let followUserId = await followService.followUserIds(req.user.id);

      return res.status(200).send({
          message: "Successfully following.",
          status: "Success",
          follows,
          totalPages: Math.ceil(totalFollows / itemsPerPage),
          user_following: followUserId.following,
          user_follow_me: followUserId.followers
      });
  } catch (error) {
      return res.status(500).send({
          message: "An unexpected error occurred while fetching following users.",
          status: "Error",
      });
  }
}

//(Soy seguido)
const followers = async(req,res) => {
  try {
          // Obtener el ID del usuario identificado
          let userId = req.user.id;

          // Verificar si el ID se está pasando por la URL
          if (req.params.id) userId = req.params.id;
    
          // Verificar si se está recibiendo el número de página, si no es así, usar la página 1
          let page = 1;
          if (req.params.page) {
              page = req.params.page;
          }
    
          // Usuarios por página
          const itemsPerPage = 5;

          // Encontrar el total de usuarios que sigue
          const totalFollows = await Follow.countDocuments({ user: userId });

          // Encontrar los usuarios que sigue y poblar los datos de los usuarios
          const follows = await Follow.find({ followed: userId })
              .populate('followed', "-password -role -__v")
              .skip((page - 1) * itemsPerPage)
              .limit(itemsPerPage)
              .exec();

          let followUserId = await followService.followUserIds(req.user.id);

          return res.status(200).send({
              message: "Successfully following.",
              status: "Success",
              follows,
              totalPages: Math.ceil(totalFollows / itemsPerPage),
              user_following: followUserId.following,
              user_follow_me: followUserId.followers
      });
    
  } catch (error) {
    return res.status(500).send({
      message: "An unexpected error occurred during the unfollow process.",
      status: "Error",
    });
  }

  return res.status(200).send({
    message: "Successfully followers.",
    status: "Success",
  });
}

module.exports = {
    save,
    unfollow,
    following,
    followers
}