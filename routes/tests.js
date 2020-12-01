const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireAdminLogin = require('../middleware/requireAdminLogin')
const requireInstructorLogin = require('../middleware/requireInstructorLogin')
const requireStudentLogin = require('../middleware/requireStudentLogin')
const Test = mongoose.model("Test")


router.post('/upload-test', (req, res) => {
    const { 
        type,
        classSelected,
        subject,
        term,
        week,
        topic,
        hours,
        minutes,
        questions,
    } = req.body
    if(!type || !classSelected || !subject || !term || !week || !hours || !minutes || !topic || !questions){
        return res.status(422).json({error: "Please add all the fields"})
    }
    
    const test = new Test({
        type,
        classSelected,
        subject,
        term,
        week,
        hours,
        minutes,
        topic,
        questions
    })
    test.save().then(result => {
        return res.json({test: result})
    })
    .catch(err => { console.log(err) })

})

router.get('/all-tests', (req, res) => {
    Test.find()
        .then(tests => {
            return res.json({tests})
        })
        .catch(err => {
                res.json({tests})
                console.log(err)
        })
})

router.get('/test-details/:testId', (req, res) => {
    Test.findOne({_id: req.params.testId})
    .then(test => {
        Test.find({testId: req.params.testId})
        .populate("postedBy", "_id topic")
        .exec((err, tests) => {
            if(err){
                return res.status(422).json({error: err})
            }
            res.json({test, tests})
        })
    }).catch(err => {
        return res.status(404).json({error: "Property not found"})
    })
})

router.get('/student/test-details/:testId', (req, res) => {
    Test.findOne({topic: req.params.testId})
    .then(test => {
        Test.find({testId: req.params.testId})
        .populate("postedBy", "topic topic")
        .exec((err, tests) => {
            if(err){
                return res.status(422).json({error: err})
            }
            res.json({test, tests})
        })
    }).catch(err => {
        return res.status(404).json({error: "Property not found"})
    })
})

router.get('/test-details/questions/:testId', (req, res) => {
    Test.findOne({_id: req.params.testId})
        .then(test => {
            Test.find({testId: req.params.testId})
            .populate("postedBy", "questions topic")
            .exec((err, tests) => {
                if(err){
                    return res.status(422).json({error: err})
                }
                res.json({test, tests})
            })
        })
        .catch(err => {
            return res.status(404).json({error: "Questions not found"})
        })
})



router.delete('/delete-test/:testId', (req, res) => {
    Test.findOne({_id: req.params.testId})
    .populate("postedBy", "_id")
    .exec((err, test) => {
        if(err || !test){
            return res.status(422).json({error: err})
        }
        test.remove()
        .then(result => {
            res.json({message: "successfully deleted"})
        }).catch(err => {
            console.log(err)
        })
    })
})



router.put('/take-test',requireStudentLogin,(req,res)=>{

    const { score, textId } = req.body

    if(!score || !textId) return res.status(422).json({error: "Fill in all fields..."})

    const student = { score, studentId: req.student._id }
    
    Test.findOne( {_id: textId} )
        .then( test => {

            const quest = test.questions

            res.json({message: "Test already taken by you...", quest})

            // const students = test.students.map( i => i.studentId)

            // if( students.includes( student.studentId ) ) {
            //     return res.json({message: "Test already taken by you..."})
            // } else {
            //     Test.findByIdAndUpdate(textId,{ $push:{students: student} },{ new:true })
            //     .populate("students.studentId","_id firstName")
            //     .exec((err,result)=>{
            //         if(err){
            //             return res.status(422).json({error:err, message: "Test does not exit..."})
            //         }else{
            //             res.json(result)
            //         }
            //     })
            // }
            
        })
        .catch( err =>  res.status(404).json({error: "Test not found..."}) )

})


module.exports = router
