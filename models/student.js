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
    "1": {
        "default": false,
        "type": Boolean
    },
    "2": {
        "default": false,
        "type": Boolean
    },
    "3": {
        "default": false,
        "type": Boolean
    },
    "4": {
        "default": false,
        "type": Boolean
    },
    "5": {
        "default": false,
        "type": Boolean
    },
    "6": {
        "default": false,
        "type": Boolean
    },
    "7": {
        "default": false,
        "type": Boolean
    },
    "8": {
        "default": false,
        "type": Boolean
    },
    "9": {
        "default": false,
        "type": Boolean
    },
    "10": {
        "default": false,
        "type": Boolean
    },
    "11": {
        "default": false,
        "type": Boolean
    },
    "12": {
        "default": false,
        "type": Boolean
    },
    "13": {
        "default": false,
        "type": Boolean
    },
    "14": {
        "default": false,
        "type": Boolean
    },
    "15": {
        "default": false,
        "type": Boolean
    },
    "16": {
        "default": false,
        "type": Boolean
    },
    "17": {
        "default": false,
        "type": Boolean
    }
})

mongoose.model("Student", studentSchema)
