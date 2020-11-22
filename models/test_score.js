const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const testScoreSchema = new mongoose.Schema({
    testId: {
        type:ObjectId,
        ref:"Test"
    },
    score: { 
        type: Number,
        required: true
    },
    studentId: {
        type:ObjectId,
        ref:"Student"
    },
})

mongoose.model("TestScore", testScoreSchema)