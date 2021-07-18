const mongoose = require('mongoose');


const  mediaSchema = new mongoose.Schema({
    userId: String,
    username: String,
    media: String,
    title: String,
    date: {
        type: Date,
        default: Date.now()
    },
    thumbnail: String 
})

const media = mongoose.model('media', mediaSchema)

module.exports = media