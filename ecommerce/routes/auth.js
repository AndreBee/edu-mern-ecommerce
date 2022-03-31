const express = require('express')
const router = express.Router()

const {signup, signin, signout, requireSignin} = require('../controllers/auth')
const {userSignupValidator} = require('../validators/index')

router.post('/signup', userSignupValidator, signup)
router.post('/signin', signin)
router.get('/signout', signout)

// exporting module to be used elsewhere
module.exports =  router