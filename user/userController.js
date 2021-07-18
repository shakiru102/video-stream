const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const token = (id) => {
    return jwt.sign({ id }, 'this is stream secret')
}
let maxTime = 1 * 24 * 60 * 60

module.exports.signup = async (req, res) => {
     const { username, password } = req.body
     try {
        const user = await User.create({ username, password })
        res.status(200)
        res.cookie('streamToken', token(user._id), { httpOnly: true, maxAge: maxTime * 1000  }  )
        res.json(user)
         
     } catch (error) {
        if(error.code === 11000){
            res.status(400)
            res.send('this username has already been used')   
        }
     }
};

module.exports.isloggedin = async (req, res) => {
    const secureCookie = await req.cookies.streamToken
    if(secureCookie){
        jwt.verify(secureCookie, 'this is stream secret', async function (error, decoded){
            if(decoded){
                const user = await User.findById({ _id: decoded.id })
                res.status(200)
                res.json(user)
            }else{
                res.status(200).send(null)
            }
            
          })
    }else{
        res.status(200).send(null)
    }
     
};
module.exports.login = async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    try {
        if(user){
            const auth = await bcrypt.compare(password, user.password)
            if(auth){
                res.cookie('streamToken', token(user._id), { httpOnly: true, maxAge: maxTime * 1000 })
                res.status(200).json(user)
            }
            throw Error('password is incorrect')
        }
        throw Error('username is incorrect')
    
    } catch (error) {
        res.status(400).send(error.message)
    }
}