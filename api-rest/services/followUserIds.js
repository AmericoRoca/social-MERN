const Follow = require("../models/Follow")


const followUserIds = async (identityUserId) => {

    try {
        //sacar info seguimiento
        let following = await Follow.find({ "user": identityUserId })
        .select({"_id": 0, "__v": 0, "user":0})
        .exec();

        let followers = await Follow.find({ "followed": identityUserId })
        .select({"_id": 0, "__v": 0, "user":0})
        .exec();

        //procesar array de id
        let following_clean = [];

        following.forEach(follow => {
            following_clean.push(follow.followed);
        })

        //procesar array de id
        let followers_clean = [];

        followers.forEach(follow => {
            followers_clean.push(follow.user);
        })

        return {
            following: following_clean,
            followers: followers_clean
        };
    } catch (error) {
        // Manejar el error de manera adecuada si ocurre
        console.log(error);
        throw error;
        
    }
};


const followThisUser = async(identityUserId, profileUserId) =>{
    try {
           //sacar info seguimiento
           let following = await Follow.findOne({ "user": identityUserId, "followed": profileUserId})
           .select({"_id": 0, "__v": 0, "user":0})
           .exec();
   
           let followers = await Follow.findOne({ "user": profileUserId, "followed": identityUserId })



           return {
            following,
            followers
        };

    } catch (error) {
        // Manejar el error de manera adecuada si ocurre
        console.log(error);
        throw error;
    }
}

module.exports = {
    followUserIds,
    followThisUser
}