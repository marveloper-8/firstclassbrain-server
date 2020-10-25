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
        type: Number,
        requred: true
    },
    time: {
        type: Number,
        requred: true
    },
    topic: {
        type: String,
        required: true
    },
    questions: [{
        id: {
            type: Number,
            required: true
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
    comments: [{
        text:String,
        postedBy:{
            type: ObjectId,
            ref: "Admin"
        }
    }],
    postedBy: {
        type: ObjectId,
        ref: "Admin"
    }
}, {timestamps: false})

mongoose.model("Test", testSchema)
