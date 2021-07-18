const Media = require('../models/media')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')

module.exports.videoupload =  (req, res) => {
              const { userId, username, title } = req.body
              ffmpeg(req.file.path)
              .on('filenames', async (filenames) => {
                const data = {
                  userId: userId,
                  username: username,
                  media: req.file.originalname,
                  title: title,
                  thumbnail: filenames.toString()
                }
                 await Media.create(data)
                  res.status(200).send('sent')
              })
              .screenshots({
                folder: 'uploads/thumbnails',
                filename: Date.now() + 'thumbnail-stream.png',
                count: 1
              })
            
}
module.exports.thumbnail = (req, res) => {
  fs.createReadStream(`uploads/thumbnails/${req.params.id}`).pipe(res)

}
module.exports.getvideos = async (req, res) => {
  const media = await Media.find({})
   !media ? res.status(400).send('can not get data') : res.status(200).json(media)
  
}

module.exports.videostreaming = async (req, res) => {
        const video = await Media.findById({ _id: req.params.id })
        const range = req.headers.range
        const start = Number(range.replace(/\D/g, ''))
        const chunksize = 1 * 1e+6
        const filesize = fs.statSync(`uploads/${video.media}`).size
        const end = Math.min(start + chunksize, filesize -1 )
        const contentlength = end - start + 1
        const header = {
          "Content-Range": `bytes ${ start } - ${ end }/${ filesize }`,
          "Accepted-Range": "bytes",
          "Content-Length": contentlength,
          "Content-Type": "video/mp4"
        }
        res.writeHead(206, header)
        fs.createReadStream(`uploads/${video.media}`, { start, end }).pipe(res)
}

module.exports.getauthvideos = async (req, res) => {
    const userId =  req.query.userId
    const videos = await Media.find({ userId })
  res.json(videos)
}
module.exports.deleteauthvideos = async (req, res) => {
 const video = await Media.findById({ _id: req.params.id })
   fs.unlink(`uploads/thumbnails/${ video.thumbnail }`,  (err => {
    if(!err){
     fs.unlink(`uploads/${ video.media }`,  ( async (err) => {
      await Media.deleteOne({_id: req.params.id })
      res.status(200).send('video deleted successfully')

     }))
    }
  }))
  
}