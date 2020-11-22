const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    authenticated:{
        type: String
    },
    password:{
        type: String,
        required: true
    }
})

mongoose.model("Admin", adminSchema)
