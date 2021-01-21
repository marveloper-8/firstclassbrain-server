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
        type: String,
        required: true
    },
    classSelected: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    term: {
        type: String,
        requred: true
    },
    week: {
        type: String
    },
    hours: {
        type: String,
        default: 0
    },
    minutes: {
        type: String
    },
    topic: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
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
        score: { type: String },
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