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
        required: true,
        unique: true,
        lowercase: true
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
        type: String,
        default: "false"
    },
    expiryDate: {
        type: Date,
    },
    paymentReference:{
        type: String
    },
    password:{
        type: String,
        required: true
    },
    originalPassword:{
        type: String
    },
    resetToken:{
        type: String,
    },
    expireToken:{
        type: Date,
    },
    pic:{
     type:String,
     default:"https://extras.firstclassbrain.com/student-dp.png"
    },
    role:{
        type: String,
        default: "Student"
    },
    bankAuth: {
        authorization_code: { type: String },
        card_type: { type: String },
        last4: { type: String },
        exp_month: { type: String },
        exp_year: { type: String },
        bin: { type: String },
        bank: { type: String },
        channel: { type: String },
        signature: { type: String },
        reusable: { type: Boolean },
        country_code: { type: String },
    }
})

mongoose.model("Student", studentSchema)
