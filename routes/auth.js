const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Student = mongoose.model("Student")
const Instructor = mongoose.model("Instructor")
const Admin = mongoose.model("Admin")

const requireStudentLogin = require('../middleware/requireStudentLogin')

const {JWT_SECRET} = require('../config/keys')

router.post('/signup-student', (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        address,
        classSelected,
        pic,
        one,
        two,
        three,
        four,
        five,
        six,
        seven,
        eight,
        nine,
        ten,
        eleven,
        twelve,
        thirteen,
        fourteen,
        fifteen,
        sixteen,
        seventeen,
        password
    } = req.body
    if(!firstName || !lastName || !email || !phone || !dateOfBirth || !address || !classSelected || !password){
        return res.status(422).json({error: "Please add all the fields"})
    }
    Student.findOne({email: email})
        .then((savedStudent) => {
            if(savedStudent){
                return res.status(422).json({error: "Student already exists with that email"})
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const student = new Student({
                        firstName,
                        lastName,
                        email,
                        phone,
                        dateOfBirth,
                        address,
                        classSelected,
                        pic,
                        one,
                        two,
                        three,
                        four,
                        five,
                        six,
                        seven,
                        eight,
                        nine,
                        ten,
                        eleven,
                        twelve,
                        thirteen,
                        fourteen,
                        fifteen,
                        sixteen,
                        seventeen,
                        password: hashedPassword,

                    })
                    student.save()
                        .then(student => {
                            res.json({message: "Saved successfully"})
                        })
                        .catch(err => {
                            console.log(err)
                        })

                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin-student', (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error: "Please add email or password"})
    }
    Student.findOne({email:email})
        .then(savedStudent => {
            if(!savedStudent){
                return res.status(422).json({error: "Invalid email or password"})
            }
            bcrypt.compare(password, savedStudent.password)
                .then(doMatch => {
                    if(doMatch){
                        // return res.json({message: "Successfully logged in"})
                        const token = jwt.sign({_id: savedStudent._id}, JWT_SECRET)
                        return res.json({token})
                    }
                    else{
                        return res.status(422).json({error: "Invalid email or password"})
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})


router.post('/web/signin-student', (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error: "Please add email or password"})
    }
    Student.findOne({email:email})
        .then(savedStudent => {
            if(!savedStudent){
                return res.status(422).json({error: "Invalid email or password"})
            }
            bcrypt.compare(password, savedStudent.password)
                .then(doMatch => {
                    if(doMatch){
                        // return res.json({message: "Successfully logged in"})
                        const token = jwt.sign({_id: savedStudent._id}, JWT_SECRET)
                        const {
                            _id, 
                            firstName,
                            lastName,
                            middleName,
                            email,
                            phone,
                            address,
                            school,
                            schoolClass,
                            one,
                            two,
                            three,
                            four,
                            five,
                            six,
                            seven,
                            eight,
                            nine,
                            ten,
                            eleven,
                            twelve,
                            thirteen,
                            fourteen,
                            fifteen,
                            sixteen,
                            seventeen,
                            pic
                        } = savedStudent
                        return res.json({token, student:{
                            _id, 
                            firstName,
                            lastName,
                            middleName,
                            email,
                            phone,
                            address,
                            school,
                            schoolClass,
                            one,
                            two,
                            three,
                            four,
                            five,
                            six,
                            seven,
                            eight,
                            nine,
                            ten,
                            eleven,
                            twelve,
                            thirteen,
                            fourteen,
                            fifteen,
                            sixteen,
                            seventeen,
                            pic
                        }})
                    }
                    else{
                        return res.status(422).json({error: "Invalid email or password"})
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})


// list of students
router.get('/all-student', (req, res) => {
    Student.find()
        // .populate("postedBy", "_id fullName")
        .then(student => {
            res.json({student})
        })
        .catch(err => {
            console.log(err)
        })
})

router.post("/pay-basic-one", (req,res) => {   
    Post.findByIdAndUpdate(req.post._id, { one:  true }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})
// end of list of students





router.post('/signup-instructor', (req, res) => {
    const {
        firstName,
        lastName,
        otherName,
        phone,
        email,
        address,
        pic,
        password
    } = req.body
    if(!firstName || !lastName || !otherName || !phone || !email || !address || !password){
        return res.status(422).json({error: "Please add all the fields"})
    }
    Instructor.findOne({email: email})
        .then((savedInstructor) => {
            if(savedInstructor){
                return res.status(422).json({error: "Instructor already exists with that email"})
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const instructor = new Instructor({
                        firstName,
                        lastName,
                        otherName,
                        phone,
                        email,
                        address,
                        pic,
                        password: hashedPassword,

                    })
                    instructor.save()
                        .then(instructor => {
                            res.json({message: "Saved successfully"})
                        })
                        .catch(err => {
                            console.log(err)
                        })

                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin-instructor', (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error: "Please add email or password"})
    }
    Instructor.findOne({email:email})
        .then(
            savedInstructor => {
            if(!savedInstructor){
                return res.status(422).json({error: "Invalid email or password"})
            }
            bcrypt.compare(password, savedInstructor.password)
                .then(doMatch => {
                    if(doMatch){
                        // return res.json({message: "Successfully logged in"})
                        const token = jwt.sign({_id: savedInstructor._id}, JWT_SECRET)
                        return res.json({token})
                    }
                    else{
                        return res.status(422).json({error: "Invalid email or password"})
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})

// list of instructor
router.get('/all-instructor', (req, res) => {
    Instructor.find()
        // .populate("postedBy", "_id fullName")
        .then(instructor => {
            res.json({instructor})
        })
        .catch(err => {
            console.log(err)
        })
})
// end of list of instructor





router.post('/signup-admin', (req, res) => {
    const {
        firstName,
        email,
        pic,
        password
    } = req.body
    if(!firstName || !email || !password){
        return res.status(422).json({error: "Please add all the fields"})
    }
    Admin.findOne({email: email})
        .then((savedAdmin) => {
            if(savedAdmin){
                return res.status(422).json({error: "Admin already exists with that email"})
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const admin = new Admin({
                        firstName,
                        email,
                        pic,
                        password: hashedPassword,

                    })
                    admin.save()
                        .then(admin => {
                            res.json({message: "Saved successfully"})
                        })
                        .catch(err => {
                            console.log(err)
                        })

                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin-admin', (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error: "Please add email or password"})
    }
    Admin.findOne({email:email})
        .then(savedAdmin => {
            if(!savedAdmin){
                return res.status(422).json({error: "Invalid email or password"})
            }
            bcrypt.compare(password, savedAdmin.password)
                .then(doMatch => {
                    if(doMatch){
                        // return res.json({message: "Successfully logged in"})
                        const token = jwt.sign({_id: savedAdmin._id}, JWT_SECRET)
                        return res.json({token})
                    }
                    else{
                        return res.status(422).json({error: "Invalid email or password"})
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})



// Using token to get user details
router.get('/usertoken/:token', (req, res) => {

    const {token} = req.params

    jwt.verify(token, JWT_SECRET, (err, payload) => {

        const {_id} = payload

        Student.findById(_id)
        .select("-password")
        .then(studentData => {
            if(studentData) return res.json({studentData, user: "Student"})
        })

        Instructor.findById(_id)
        .select("-password")
        .then(instructorData => {
            if(instructorData) return res.json({instructorData, user: "Instructor"})
        })

        Admin.findById(_id)
        .select("-password")
        .then(adminData => {
            if(adminData) return res.json({adminData, user: "Admin"})
        })

    })

})

module.exports = router
