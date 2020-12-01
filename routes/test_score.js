const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireAdminLogin = require('../middleware/requireAdminLogin')
const requireInstructorLogin = require('../middleware/requireInstructorLogin')
const requireLogin = require('../middleware/requireStudentLogin')
const Test = mongoose.model("Test")
const TestScore = mongoose.model("TestScore")

// Submit test score
router.post("/test-score", (req,res) => {  
    
    const { testId, studentId, score } = req.body

    if( !testId || !studentId || !score ){
        return res.status(422).json({error: "Please add all the fields"})
    }
    
    const testScore = new TestScore({
        testId,
        studentId,
        score
    })

    TestScore.findOne({ testId, studentId })
        .then(result => {

            if(result) return res.json({message: 'Test already taken by you...'})

            testScore.save()
                .then(score => {
                    return res.json({score})
                })
                .catch(err => {
                    console.log(err)
                })
                
        })
        .catch(err => {
            console.log(err)
        })

})  


// Get test score 
router.get("/test-score/:studentId", (req,res) => {  
    
    const { studentId } = req.params

    if( !studentId ){
        return res.status(422).json({error: "Please add all the fields"})
    }
    
    TestScore.find({ studentId })
        .populate("testId","_id type classSelected subject term week topic")
        .populate("studentId","_id firstName")
        .then(result => {
            return res.json({studentScore: result})
        })
        .catch(err => {
            console.log(err)
        })

})
module.exports = router
