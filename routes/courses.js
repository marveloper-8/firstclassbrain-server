const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireAdminLogin = require('../middleware/requireAdminLogin')
const requireInstructorLogin = require('../middleware/requireInstructorLogin')
const requireStudentLogin = require('../middleware/requireStudentLogin')
const Post = mongoose.model("Post")
// const Transaction = mongoose.model("Transaction")

// posts
router.post('/upload-course', (req, res) => {
    const {
        classSelected,
        subject,
        department,
        term,
        week,
        courseTitle,
        video,
        firstTextSlide,
        secondTextSlide,
        thirdTextSlide,
        fourthTextSlide,
        courseThumbnail,
        firstImageSlide,
        secondImageSlide,
        thirdImageSlide,
        fourthImageSlide
    } = req.body

    if(!classSelected || !subject || !term || !week || !courseTitle || !firstTextSlide || !secondTextSlide || !thirdTextSlide || !fourthTextSlide || !firstImageSlide){
        return res.status(422).json({error: "Please add all the fields"})
    }
    
    const post = new Post({
        classSelected,
        subject,
        department,
        term,
        week,
        video,
        courseTitle,
        firstTextSlide,
        secondTextSlide,
        thirdTextSlide,
        fourthTextSlide,
        courseThumbnail,
        firstImageSlide,
        secondImageSlide,
        thirdImageSlide,
        fourthImageSlide,
        postedBy: req.admin
    })
    post.save().then(result => {
        return res.json({post: result})
    })
    .catch(err => {
        return res.json({err})
        console.log(err)
    })
})

router.get('/all-courses', (req, res) => {
    Post.find()
        .populate("postedBy", "_id firstName")
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



router.delete('/delete-post/:postId', (req, res) => {
    Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if(err || !post){
            return res.status(422).json({error: err})
        }
        post.remove()
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

router.put('/like',requireStudentLogin,(req,res)=>{
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
router.put('/unlike',requireStudentLogin,(req,res)=>{
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

router.put('/comment',requireStudentLogin,(req,res)=>{
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











router.get('/my-dashboard', requireStudentLogin, (req, res) => {
    Post.find({postedBy: req.student._id})
        .populate("postedBy", "_id name")
        .then(myPost => {
            return res.json({myPost})
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like', requireStudentLogin, (req, res) => {
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

router.put('/unlike', requireStudentLogin, (req, res) => {
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

//     /* Classes

//         Nursery One
//         Nursery Two
//         Primary One
//         Primary Two
//         Primary Three
//         Primary Four
//         Primary Five
//         Primary Six
//         Junior Secondary One
//         Junior Secondary Two
//         Junior Secondary Three
//         Senior Secondary One
//         Senior Secondary Two
//         Senior Secondary Three

//     Classes */


module.exports = router
