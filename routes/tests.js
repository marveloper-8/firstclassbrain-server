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
        time,
        questions,
    } = req.body
    if(!type || !classSelected || !subject || !term || !week || !topic || !questions){
        return res.status(422).json({error: "Please add all the fields"})
    }

    // req.admin.password = undefined
    
    const test = new Test({
        type,
        classSelected,
        subject,
        term,
        week,
        time,
        topic,
        questions
    })
    test.save().then(result => {
        return res.json({test: result})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/all-tests', (req, res) => {
    Test.find()
        .then(tests => {
            res.json({tests})
        })
        .catch(err => {
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


router.put('buy-course/:postId', (req, res) => {
    var updatedRecord = {
        paid: true
    }

    Post.findByIdAndUpdate(req.params._id, { $set: updatedRecord },{new:true}, (err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while updating a record : ' + JSON.stringify(err, undefined, 2))
    })
})

router.post("/bought-course/:postId", (req,res) => {  
    
    Post.findByIdAndUpdate( req.params.postId, { $set: {paid: true} }, {useFindAndModify: false},
    // Post.findByIdAndUpdate({ _id:  req.post.postId },
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})  

router.post("/buy--course/:postId", (req,res) => {  
    let updatedRecord = {
        courseTitle: "Edited"
    }
    
    Post.findByIdAndUpdate( 
        req.params._id, 
        updatedRecord, 
        {useFindAndModify: false},
    // Post.findByIdAndUpdate({ _id:  req.post.postId },
        function(err, updatedRecord) {  
            if (err) {  
                console.log("err", err)
                res.send(err);  
                return;  
            }  else{
                res.send({data:"Record has been Updated..!!"});  
                res.send(updatedRecord)
            }
            
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











router.get('/my-dashboard', requireLogin, (req, res) => {
    Post.find({postedBy: req.student._id})
        .populate("postedBy", "_id name")
        .then(myPost => {
            return res.json({myPost})
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes: req.student._id}
    }, {
        new: true
    })
    // .populate("likes", "-id firstName")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        } else{
            res.json(result)
        }
    })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes: req.student._id}
    }, {
        new: true
    }).exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        } else{
            res.json(result)
        }
    })
})






module.exports = router
