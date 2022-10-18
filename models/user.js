const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type : Stirng,
        required : true
    },
    password : {
        type : Stirng,
        required : true
    },
    roles : [{
        type : Stirng,
        default: 'employee'
    }],
    active : {
        type : Boolean,
        default : true
    },
})

module.exports = mongoose.model('User', userSchema)