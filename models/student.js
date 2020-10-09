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
        "default": false,
        "type": Boolean
    },
    four: {
        "class": 4,
        "default": false,
        "type": Boolean
    },
    five: {
        "class": 5,
        "default": false,
        "type": Boolean
    },
    six: {
        "class": 6,
        "default": false,
        "type": Boolean
    },
    seven: {
        "class": 7,
        "default": "false",
        "type": String
    },
    eight: {
        "class": 8,
        "default": false,
        "type": Boolean
    },
    nine: {
        "class": 9,
        "default": false,
        "type": Boolean
    },
    ten: {
        "class": 10,
        "default": false,
        "type": Boolean
    },
    eleven: {
        "class": 11,
        "default": false,
        "type": Boolean
    },
    twelve: {
        "class": 12,
        "default": false,
        "type": Boolean
    },
    thirteen: {
        "class": 13,
        "default": false,
        "type": Boolean
    },
    fourteen: {
        "class": 14,
        "default": false,
        "type": Boolean
    },
    fifteen: {
        "class": 15,
        "default": false,
        "type": Boolean
    },
    sixteen: {
        "class": 16,
        "default": false,
        "type": Boolean
    },
    seventeen: {
        "class": 17,
        "default": false,
        "type": Boolean
    }
})

mongoose.model("Student", studentSchema)
