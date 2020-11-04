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
    emailToken:{
        type: String
    },
    isVerified:{
        type: Boolean
    },
    phone:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    classSelected:{
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
    resetToken:String,
    expireToken:Date,
    pic:{
     type:String,
     default:"https://res.cloudinary.com/cnq/image/upload/v1586197723/noimage_d4ipmd.png"
    },
    one: {
        "class": 1,
        "default": "false",
        "type": String
    },
    two: {
        "class": 2,
        "default": "false",
        "type": String
    },
    three: {
        "class": 3,
        "default": "false",
        "type": String
    },
    four: {
        "class": 4,
        "default": "false",
        "type": String
    },
    five: {
        "class": 5,
        "default": "false",
        "type": String
    },
    six: {
        "class": 6,
        "default": "false",
        "type": String
    },
    seven: {
        "class": 7,
        "default": "false",
        "type": String
    },
    eight: {
        "class": 8,
        "default": "false",
        "type": String
    },
    nine: {
        "class": 9,
        "default": "false",
        "type": String
    },
    ten: {
        "class": 10,
        "default": "false",
        "type": String
    },
    eleven: {
        "class": 11,
        "default": "false",
        "type": String
    },
    twelve: {
        "class": 12,
        "default": "false",
        "type": String
    },
    thirteen: {
        "class": 13,
        "default": "false",
        "type": String
    },
    fourteen: {
        "class": 14,
        "default": "false",
        "type": String
    },
    fifteen: {
        "class": 15,
        "default": "false",
        "type": String
    },
    sixteen: {
        "class": 16,
        "default": "false",
        "type": String
    },
    seventeen: {
        "class": 17,
        "default": "false",
        "type": String
    }
})

mongoose.model("Student", studentSchema)
