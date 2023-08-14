const Publication = require("../models/Publication")
const fs = require("fs")
const path = require("path");


const followService = require("../services/followUserIds")


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
const upload = async (req, res) => {
    try {
        
      //Sacar publication id
      const publicationId = req.params.id;

      // Get file image and check if it exists
      if (!req.file) {
        return res.status(400).send({
          message: "Request doesn't include the image",
          status: "Error",
        });
        
      }
  
      // Get file name
      const image = req.file.originalname;
  
      // Extract ext of the file
      const imageSplit = image.split(".");
      const ext = imageSplit[imageSplit.length - 1].toLowerCase(); // Convert the extension to lowercase
  
      // Check ext
      if (ext !== "png" && ext !== "jpeg" && ext !== "jpg" && ext !== "gif") {
        const filePath = req.file.path;
        await fs.unlinkSync(filePath); // Delete the file
        res.status(400).send({
          message: "File extension invalid",
          status: "Error",
        });
        
      }
  
      // Delete or save the file as per your requirement
      const publicationUpdated = await Publication.findByIdAndUpdate({"user": req.user.id, "_id": publicationId}, {file: req.file.filename}, {new:true})
  
      if(!publicationUpdated){
        res.status(500).send({
          message: "Error in the avatar upload",
          status: "Error",
        });
      }
  
      return res.status(200).send({
        message: "Working subida de imagenes",
        status: "Success",
        file: req.file,
        publication: publicationUpdated
      });
  
    } catch (error) {
        console.log(error)
      return  res.status(500).send({
        message: "Error in the query",
        status: "Error",
      });
    }
};


//devolver archivos multimedia
const media = (req,res) =>{

    try {
      //Get the param from url
      const file = req.params.file;
  
      //Build a path for the image
      const filePath = "./uploads/publications/"+file;
  
  
      //Check if the file exists
      fs.stat(filePath, (err, exists) =>{
  
        if(err){
          console.log(err)
          res.status(404).send({
            message: "Image doesn't exists",
            status: "Error"
          });
        }
  
        
        //Return file
        return res.sendFile(path.resolve(filePath));
  
  
      })
  
  
    } catch (error) {
      return res.status(500).send({
        message: "Error in the query",
        status: "Error",
      });
    }
  
}


//listar publicacion (feed)
const user = async(req,res) =>{
    try {
        //sacar id de usuario
        const userId = req.params.id;


        //controlar la pagina
        let page = 1;

        if (req.params.page) {
            page = parseInt(req.params.page);
          }
      
          console.log('Page:', page);
      
          // Número de resultados por página
          let items_per_page = 5;

          if (req.query.items_per_page) {
            items_per_page = parseInt(req.query.items_per_page);
          }
      
          // Calcular el número de documentos a omitir en la consulta
          const skipDocuments = (page - 1) * items_per_page;
      
          // Consulta con paginación utilizando skip() y limit()
          const totalPublications = await Publication.countDocuments();

            
            if (!totalPublications) {
                return res.status(500).send({
                message: 'Error in the database',
                status: 'Error',
                });
            }


        //ordenar articulos y paginar
        const publications = await Publication.find({"user": userId})
            .sort("_id")
            .populate('user', '-password -__v -role')
            .skip(skipDocuments)
            .limit(items_per_page)
            .exec();

        if(!publications){
            return res.status(404).send({
                status: "Error",
                message: "Publications doesnt exits",
            })
        }

        //devolver respuesta
        return res.status(200).send({
            status: "Success",
            message: "Publication of the user",
            items: items_per_page,
            pages: Math.ceil(totalPublications / items_per_page), // Calcular el número total de páginas
            totalPublications,
            page: page,
            publications: publications,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: "Error",
            message: "Publications doesnt exits",
        })
    }
}


//listar publicaciones de un usuario
const feed = async(req,res) =>{
    try {

         //controlar la pagina
         let page = 1;

         if (req.params.page) {
             page = parseInt(req.params.page);
           }
       
           console.log('Page:', page);
       
           // Número de resultados por página
           let items_per_page = 5;
 
           if (req.query.items_per_page) {
             items_per_page = parseInt(req.query.items_per_page);
           }

     
            const myFollows = await followService.followUserIds(req.user.id);

            if(!myFollows){
                
                return res.status(500).send({
                    status: "Error",
                    message: "Publications doesnt exits",
                })
            }

           
           // Calcular el número de documentos a omitir en la consulta
           const skipDocuments = (page - 1) * items_per_page;
       
           // Consulta con paginación utilizando skip() y limit()
           const totalPublications = await Publication.countDocuments();
 
             
             if (!totalPublications) {
                 return res.status(500).send({
                 message: 'Error in the database',
                 status: 'Error',
                 });
             }
 
 
         //ordenar articulos y paginar
         const publications = await Publication.find({"user": myFollows.following})
             .sort("_id")
             .populate('user', '-password -__v -role')
             .skip(skipDocuments)
             .limit(items_per_page)
             .exec();
 
         if(!publications){
             return res.status(404).send({
                 status: "Error",
                 message: "Publications doesnt exits",
             })
         }
 
         //devolver respuesta
         return res.status(200).send({
             status: "Success",
             message: "Publication of the user",
             items: items_per_page,
             pages: Math.ceil(totalPublications / items_per_page), // Calcular el número total de páginas
             totalPublications,
             page: page,
             following: myFollows.following,
             publications
         })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: "Error",
            message: "Publications doesnt exits",
        })
    }
}




module.exports = {
    testPublication,
    save,
    detail,
    deletePublication,
    user,
    upload,
    media,
    feed
}