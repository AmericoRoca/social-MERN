//Import modules
const jwt = require("jwt-simple");
const moment = require("moment");


// Import secret key
const libjwt = require("../services/jwt");
const secret = libjwt.secret

// Auth function
exports.auth = (req,res, next) => {

        //Check if I got the auth headers
        if(!req.headers.authorization){
            return res.status(403).send({
                status: "Error",
                message: "The request doesn't have the authentication headers"
            });
        }

    

    //Clean the token
    let token = req.headers.authorization.replace(/['"]+/g,'');



    //Decoded token
    try {
        
        let payload = jwt.decode(token, secret);

        
        //Check expiration date

        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status: "Error",
                message: "Expired Token",
                error
            }); 
        }

         //Feed
         req.user = payload;


    
    } catch (error) {
        return res.status(404).send({
            status: "Error",
            message: "Invalid Token",
            error
        });
    }

       
        next();

}