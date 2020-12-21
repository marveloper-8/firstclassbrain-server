const mongoose = require('mongoose')

const instructorSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    originalPassword: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    pic:{
     type:String,
     default:"https://extras.firstclassbrain.com/instructor-dp.png"
    }
})

mongoose.model("Instructor", instructorSchema)
