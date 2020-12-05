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
        required: true
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
     default:"https://res.cloudinary.com/cnq/image/upload/v1586197723/noimage_d4ipmd.png"
    },
})

mongoose.model("Instructor", instructorSchema)
