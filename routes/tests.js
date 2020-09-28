const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireAdminLogin = require('../middleware/requireAdminLogin')
const requireInstructorLogin = require('../middleware/requireInstructorLogin')
const requireLogin = require('../middleware/requireStudentLogin')
const Test = mongoose.model("Test")
// const Transaction = mongoose.model("Transaction")



// tests
router.post('/upload-test', (req, res) => {

    const {
        type,
        classSelected,
        subject,
        term,
        week,
        topic,
        ...questions
    } = req.body

    const [data] = questions


    const {
        question,
        answerA,
        answerB,
        answerC,
        answerD,
        correctAnswer,
        correction,
        correctionImage
    } = data


    // if(!type || !subject || !term || !week || !topic || !questions || !answerA || !answerB || !answerC || !answerD || !correctAnswer || !correction || !correctionImage){
    //     return res.status(422).json({error: "Please add all the fields"})
    // }

    // req.admin.password = undefined
    
    const test = new Test({
        ...req.body
    })
    test.save().then(result => {
        return res.json({test: result})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/all-courses', (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id firstName")
        .then(posts => {
            res.json({posts})
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/course-details/:postId', (req, res) => {
    Post.findOne({_id: req.params.postId})
    .then(post => {
        Post.find({postId: req.params.postId})
        .populate("postedBy", "_id courseTitle")
        .exec((err, posts) => {
            if(err){
                return res.status(422).json({error: err})
            }
            res.json({post, posts})
        })
    }).catch(err => {
        return res.status(404).json({error: "Property not found"})
    })
})

router.get('/courses-detail/:id', (req, res) => {
    Post.findOne({_id: req.params.id})
    .then(post => {
        Post.find({postId: req.params.id})
        .populate("postedBy", "_id propertyName")
        .exec((err, posts) => {
            if(err){
                return res.status(422).json({error: err})
            }
            res.json({post, posts})
        })
    }).catch(err => {
        return res.status(404).json({error: "Property not found"})
    })
})

router.delete('/delete-post/:postId', requireAdminLogin, (req, res) => {
    Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if(err || !post){
            return res.status(422).json({error: err})
        }
        if(post.postedBy._id.toString() === req.admin._id.toString()){
            post.remove()
            .then(result => {
                res.json({message: "successfully deleted"})
            }).catch(err => {
                console.log(err)
            })
        }
    })
})

router.post("/bought-course/:postId", (req,res) => {   
    Post.findByIdAndUpdate(req.params._id, { paid:  true },
    // Post.findByIdAndUpdate({ _id:  req.post.postId },   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})  

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.student._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.student._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.student._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id email")
    .populate("postedBy","_id email")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
// end of posts





module.exports = router
