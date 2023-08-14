const express = require("express")
const router = express.Router();
const publicationController = require("../controllers/publication");
const check = require("../middlewares/auth")


//Define routes
router.get("/test-publication", publicationController.testPublication);
router.post("/save", check.auth, publicationController.save);
router.get("/detail/:id", check.auth, publicationController.detail);
router.delete("/delete/:id", check.auth, publicationController.deletePublication);

module.exports = router;