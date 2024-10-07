const mongoose = require('mongoose');

/*
const connection = async() =>{
    try {
        
       await mongoose.connect("mongodb://localhost:27017/social-mern");

       console.log("Susccesfully connected!!");

        
    } catch (error) {
        console.log(error)
        throw new Error("It cant connect to the database");
    }
}*/

const connection = async () => {
    mongoose.connect('mongodb+srv://americochiclana:jNDcQ9bvFsD7QgqO@social-mern.kjqtu.mongodb.net/', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('Conectado a MongoDB Atlas'))
        .catch((error) => console.error('Error al conectar a MongoDB Atlas:', error));

}

module.exports = {
    connection
}