const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const testSchema = new mongoose.Schema({
    type: {
        type: Number,
        required: true
    },
    classSelected: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    term: {
        type: Number,
        requred: true
    },
    week: {
        type: Number
    },
    hours: {
        type: Number,
        requred: true
    },
    minutes: {
        type: Number,
        requred: true
    },
    topic: {
        type: String
    },
    questions: [{
        id: {
            type: Number
        },
        question: {
            type: String,
            required: true
        },
        answerA: {
            type: String,
            required: true
        },
        answerB: {
            type: String,
            required: true
        },
        answerC: {
            type: String,
            required: true
        },
        answerD: {
            type: String,
            required: true
        },
        correctAnswer: {
            type: String,
            required: true
        },
        correction: {
            type: String,
            required: true
        },
        correctionImage: {
            type: String,
            default:"https://res.cloudinary.com/cnq/image/upload/v1586197723/noimage_d4ipmd.png"
        },
    }],
    students:[{
        score: { type: Number },
        studentId: {
            type:ObjectId,
            ref:"Student"
        }
    }],
    postedBy: {
        type: ObjectId,
        ref: "Admin"
    }
}, {timestamps: false})

mongoose.model("Test", testSchema)