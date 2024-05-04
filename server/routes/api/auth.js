const express = require('express')
const router = express.Router()
const authController = require('../../controllers/authController')
const auth = require("../../middleware/authentication")

// register
router.post('/register', authController.register)

// login
router.post('/login', authController.login)

// logout
router.post('/logout', authController.logout)

// refresh token 
router.post('/refresh', authController.refresh)


//get user data 
router.get('/user', auth, authController.user)




module.exports = router