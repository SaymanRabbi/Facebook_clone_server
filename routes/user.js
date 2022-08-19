const express = require('express')
const { register, activateAccount,login,Userauth } = require('../controllers/user');
const { authUser } = require('../Middlewers/auth');
const router = express.Router()
router.post('/register', register)
router.post("/activate",authUser, activateAccount);
router.post("/login", login);
router.post("/auth",authUser, Userauth);


module.exports = router