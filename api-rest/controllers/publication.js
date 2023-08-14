const Publication = require("../models/Publication")


//test actions
const testPublication = (req,res) =>{
    return res.status(200).send({message: "Message send from controller: publication"})
}

//guardar publicacion
const save = async (req,res) =>{


    try {

        //recoger datos body
        const params = req.body;

        if(!params.text){
            return res.status(400).send({
                status: "Error",
                message: "Send text message"
            })
        }

        //crear y rellenar objeto del modelo
        let newPublication = new Publication(params);
        newPublication.user = req.user.id;

        //Guardar objeto en la bbdd
        let publicationStored = await newPublication.save()

        if(!publicationStored){
            return res.status(404).send({
                status: "Error",
                message: "No se ha guardado la publicacion"
            })
        }
            
        return res.status(200).send({
            status: "Success",
            message: "Publication saved",
            publicationStored
        })
    } catch (error) {

        console.log(error)
        return res.status(500).send({
            status: "Error",
            message: "Publication not saved",
        })
    }


}


//sacar una sola publicacion
const detail = async(req,res) =>{
    try {
        //sacar id publicacion url
        const publicationId = req.params.id;



        //find 
        const publicationStored = await Publication.findById(publicationId);
        

        if(!publicationStored){

            return res.status(404).send({
                status: "Error",
                message: "Publication doesn't exits",
            })
        }

        //devolver respuesta
        return res.status(200).send({
            status: "Success",
            message: "Detail working",
            publicationStored
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: "Error",
            message: "Publication not saved",
        })
    }
}

//eliminar publicaciones
const deletePublication = async(req,res) =>{
    try {

         //sacar id publicacion url
         const publicationId = req.params.id;


         
        //findAndDelete
        const publicationDeleted = await Publication.deleteOne({"user": req.user.id, "_id": publicationId})
        

        if(!publicationDeleted){
            return res.status(404).send({
                status: "Error",
                message: "Publication doesn't exits",
            })
        }

        //devolver respuesta
        return res.status(200).send({
            status: "Success",
            message: "Publication deleted susccessfully",
            publicationId
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: "Error",
            message: "Publication not deleted",
        })
    }
}



//subir ficheros




//devolver archivos multimedia


//listar publicacion



//listar publicaciones de un usuario





module.exports = {
    testPublication,
    save,
    detail,
    deletePublication
}