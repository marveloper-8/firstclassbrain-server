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
    maths: {
        "default": "false",
        "type": Boolean
    },
    english: {
        "default": "false",
        "type": Boolean
    },
    crk: {
        "default": "false",
        "type": Boolean
    },
    irk: {
        "default": "false",
        "type": Boolean
    },
    social_studies: {
        "default": "false",
        "type": Boolean
    },
    health_education: {
        "default": "false",
        "type": Boolean
    },
    computer: {
        "default": "false",
        "type": Boolean
    },
    spelling: {
        "default": "false",
        "type": Boolean
    },
    language: {
        "default": "false",
        "type": Boolean
    },
    diction: {
        "default": "false",
        "type": Boolean
    },
    basic_science: {
        "default": "false",
        "type": Boolean
    },
    business_studies: {
        "default": "false",
        "type": Boolean
    },
    civic: {
        "default": "false",
        "type": Boolean
    },
    basic_technology: {
        "default": "false",
        "type": Boolean
    },
    biology: {
        "default": "false",
        "type": Boolean
    },
    physics: {
        "default": "false",
        "type": Boolean
    },
    chemistry: {
        "default": "false",
        "type": Boolean
    },
    economics: {
        "default": "false",
        "type": Boolean
    },
    commerce: {
        "default": "false",
        "type": Boolean
    },
    accounting: {
        "default": "false",
        "type": Boolean
    },
    government: {
        "default": "false",
        "type": Boolean
    },
    agric_science: {
        "default": "false",
        "type": Boolean
    }
})

mongoose.model("Student", studentSchema)
