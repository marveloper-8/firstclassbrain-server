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
        required: true,
        unique: true,
        lowercase: true
    },
    resetToken:{
        type: String,
    },
    expireToken:{
        type: Date
    },
    authenticated:{
        type: String
    },
    password:{
        type: String,
        required: true
    },
    pic:{
        type:String,
        default:"https://extras.firstclassbrain.com/student-dp.png"
    }
})

mongoose.model("Admin", adminSchema)