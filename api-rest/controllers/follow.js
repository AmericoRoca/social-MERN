//Import dependencies
const Follow = require("../models/Follow")
const User = require("../models/User")




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

  

module.exports = {
    save,
    unfollow
}