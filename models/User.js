const mongoose = require('mongoose')
const timestamp =  require('mongoose-timestamp')

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: {
        first: String,
        last: String
    },
    birthday: Date,
    roles: {
        admin: { type: Boolean, default: false },
        mod: { type: Boolean, default: false },
        user: { type: Boolean, default: true }
    }
})

UserSchema.plugin(timestamp)

const User = mongoose.model('User', UserSchema)
module.exports = User