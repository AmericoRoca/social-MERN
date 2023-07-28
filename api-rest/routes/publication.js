const express = require("express")
const router = express.Router();
const publicationController = require("../controllers/publication");


//Define routes
router.get("/test-publication", publicationController.testPublication);



module.exports = router;