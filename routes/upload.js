const express = require("express");
const router = express.Router();
const {upload,listimages} = require("../controllers/upload");
const { authUser } = require("../Middlewers/auth");
const imagesauth = require("../Middlewers/imagesauth");
router.post("/upload",authUser,imagesauth,upload);
router.get("/listimages",listimages);
module.exports = router;
