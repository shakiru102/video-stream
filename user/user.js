const router = require('express').Router()
const controller = require('./userController')

router.post('/signup', controller.signup)
router.get('/isloggedin', controller.isloggedin)
router.post('/login', controller.login)


module.exports = router