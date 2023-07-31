const express = require("express")
const router = express.Router();
const userController = require("../controllers/user");
const check = require("../middlewares/auth");
const multer = require("multer");

//Upload conf
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./uploads/avatars")
    },
    filename: (req, file, cb) =>{
        cb(null, "avatar-"+Date.now()+file.originalname);
    }
})

const uploads = multer({storage});

//Define routes
router.get("/test", check.auth, userController.test);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile/:id", check.auth, userController.profile);
router.get("/list/:page?", check.auth, userController.list);
router.put("/update", check.auth, userController.updateUser);
router.post("/upload", [check.auth, uploads.single("file")], userController.uploadAvatar);
router.get("/getAvatar/:file", check.auth, userController.getAvatar);

module.exports = router;