const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const testSchema = new mongoose.Schema({
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
    image: {
        type: String
    }
}, {timestamps: false})

mongoose.model("TestItem", testSchema)