const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    pic:{
     type:String,
     default:"https://res.cloudinary.com/cnq/image/upload/v1586197723/noimage_d4ipmd.png"
    },
    password:{
        type: String,
        required: true
    }
})

mongoose.model("Admin", adminSchema)
