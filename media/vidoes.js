const router = require('express').Router()
const upload = require('../utils/multer')
const mediaFunc = require('./videosController')

router.post('/videoupload', upload.single('video'), mediaFunc.videoupload )
router.get('/thumbnail/:id', mediaFunc.thumbnail)
router.get('/video/:id', mediaFunc.videostreaming)
router.get('/getvideos', mediaFunc.getvideos)
router.get('/getauthvideos', mediaFunc.getauthvideos)
router.delete('/deleteauthvideo/:id', mediaFunc.deleteauthvideos)

module.exports = router