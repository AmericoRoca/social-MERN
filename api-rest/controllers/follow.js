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

  const unfollow = async(req,res) => {


    try {

      //Get user id
      let id = req.user.id;


      // Find coincidences
      const followedId = req.params.id;


      // Exec Remove
      let followStored = Follow.find({
        "user": userId,
        "followed": followedId
      }).remove((error, followDeleted) =>{

        if(error || ! followDeleted){
          return res.status(500).send({
            message: "Success",
            status: "Success",
            identity: req.user,
            follow: followStored,
          });
        }

        return res.status(200).send({
          message: "Success",
          status: "Success",
          identity: req.user,
          follow: followStored,
        });


      })

      
    } catch (error) {
      
      return res.status(500).send({
        message: "An unexpected error occurred during the follow process.",
        status: "Error",
      });
    }

    
  }
  

module.exports = {
    save,
    unfollow
}