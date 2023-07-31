const express = require("express")
const router = express.Router();
const followController = require("../controllers/follow");
const check = require("../middlewares/auth")


//Define routes
router.post("/save", check.auth, followController.save);



module.exports = router;