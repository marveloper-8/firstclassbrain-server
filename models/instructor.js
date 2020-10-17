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
    otherName:{
        type: String,
        required: false
    },
    phone:{
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    emailToken:{
        type: String
    },
    isVerified:{
        type: Boolean
    },
    address:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    pic:{
     type:String,
     default:"https://res.cloudinary.com/cnq/image/upload/v1586197723/noimage_d4ipmd.png"
    },
})

mongoose.model("Instructor", instructorSchema)
