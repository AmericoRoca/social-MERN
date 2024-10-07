const mongoose = require('mongoose');

const connection = async () => {
    try {
        // Utiliza la variable de entorno para la conexión a MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('Error al conectar a MongoDB Atlas:', error);
        throw new Error('No se pudo conectar a la base de datos');
    }
}

module.exports = {
    connection
}
