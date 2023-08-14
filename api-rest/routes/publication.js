const express = require("express")
const router = express.Router();
const publicationController = require("../controllers/publication");
const check = require("../middlewares/auth")
const multer = require("multer");


//Upload conf
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/publications")
    },
    filename: (req, file, cb) =>{
        cb(null, "pub-"+Date.now()+file.originalname);
    }
})

const uploads = multer({storage});

//Define routes
router.get("/test-publication", publicationController.testPublication);
router.post("/save", check.auth, publicationController.save);
router.get("/detail/:id", check.auth, publicationController.detail);
router.delete("/delete/:id", check.auth, publicationController.deletePublication);
router.get("/user/:id/:page?", check.auth, publicationController.user);
router.post("/upload/:id", [check.auth, uploads.single("file")], publicationController.upload);
router.get("/media/:file", check.auth, publicationController.media);

module.exports = router;