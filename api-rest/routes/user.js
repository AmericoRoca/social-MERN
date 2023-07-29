const express = require("express")
const router = express.Router();
const userController = require("../controllers/user");
const check = require("../middlewares/auth")

//Define routes
router.get("/test", check.auth, userController.test);
router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;