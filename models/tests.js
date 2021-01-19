const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const testSchema = new mongoose.Schema({
    postedByWho: {
        type: String,
        required: true
    },
    postedByWhoLink: {
        type: String,
        required: true
    },
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
        default: 0
    },
    minutes: {
        type: Number,
        requred: true
    },
    topic: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    questions: [{
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
        },
    }],
    students:[{
        score: { type: Number },
        studentId: {
            type:ObjectId,
            ref:"Student"
        }
    }],
    attendance: [String],
    postedBy: {
        type: ObjectId,
        ref: "Admin"
    }
}, {timestamps: false})

mongoose.model("Test", testSchema)