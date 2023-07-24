const mongoose = require('mongoose');


const connection = async() =>{
    try {
        
       await mongoose.connect("mongodb://localhost:27017/social-mern");

       console.log("Susccesfully connected!!");

        
    } catch (error) {
        console.log(error)
        throw new Error("It cant connect to the database");
    }
}

module.exports = {
    connection
}