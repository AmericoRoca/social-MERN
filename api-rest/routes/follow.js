const express = require("express")
const router = express.Router();
const followController = require("../controllers/follow");


//Define routes
router.get("/test-follow", followController.testFollow);



module.exports = router;