const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
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
    phone:{
        type: Number,
        required: true
    },
    dateOfBirth:{
        type: Date,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    schoolClass:{
        type: Number,
        required: true
    },
    paid:{
        type: Boolean,
        default: false
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

mongoose.model("Student", studentSchema)
