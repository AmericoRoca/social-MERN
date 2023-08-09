const Follow = require("../models/Follow")


const followUserIds = async (identityUserId) => {
    try {
        let following = await Follow.find({ "user": identityUserId })
        .select({"_id": 0, "__v": 0, "user":0})
        .exec();

        let followers = await Follow.find({ "followed": identityUserId })
        .select({"_id": 0, "__v": 0, "user":0})
        .exec();

        return {
            following,
            followers
        };
    } catch (error) {
        // Manejar el error de manera adecuada si ocurre
        throw error;
    }
};


const followThisUser = async(identityUserId, profileUserId) =>{

}

module.exports = {
    followUserIds,
    followThisUser
}