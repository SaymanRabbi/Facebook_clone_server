const express = require("express");
const router = express.Router();
const {
    upload
} = require("../controllers/upload");
const imagesauth = require("../Middlewers/imagesauth");
router.post("/upload",imagesauth,upload);
module.exports = router;
