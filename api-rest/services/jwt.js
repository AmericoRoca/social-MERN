//Import dependencies
const jwt = require("jwt-simple");
const moment = require("moment");

//Secret key
const secret = "CLAVE_SECRETA_SOCIAL_MERN_AMERICO_ROCA_29101991";

//Create function to generate token
exports.createToken = (user) =>{

    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix
    }

    //return jwt coded token
    return jwt.encode(payload, secret);
}
