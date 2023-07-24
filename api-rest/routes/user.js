const express = require("express")
const router = express.Router();
const userController = require("../controllers/user");


//Define routes
router.get("/test", userController.test);
router.get("/register", userController.register);


module.exports = router;