const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
})
userSchema.pre('save', async function(){
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)

})



const User = mongoose.model('stream-users', userSchema)

module.exports = User