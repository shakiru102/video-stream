const express = require('express');
const cookie = require('cookie-parser');
const mongoose = require('mongoose')
// const User = require('./models/user')
// const cors = require('cors')
require('dotenv').config()
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})

const userAuth = require('./user/user')
const funnyvideos = require('./media/vidoes')
const app = express()
const PORT = 8000 || process.env.PORT
app.use(cookie())
// app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/api', userAuth )
app.use('/api', funnyvideos )



app.listen(PORT, () => console.log('you are running on port ' + PORT))