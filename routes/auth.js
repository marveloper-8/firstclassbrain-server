const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const moment = require('moment')


const Student = mongoose.model("Student")
const Instructor = mongoose.model("Instructor")
const Admin = mongoose.model("Admin")

const { Contact } = require('../models/contact')


const requireStudentLogin = require('../middleware/requireStudentLogin')

const {EMAIL, PASSWORD, HOST, JWT_SECRET} = require('../config/keys')

const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth:{
//         api_key:SENDGRID_API
//     }
// }))

const transporter = nodemailer.createTransport({
    host: HOST,
    port: 25,
    secure: false,
    auth: {
      user: EMAIL,
      pass: PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

// router.get('/verify-email/student', (req, res) => {
//     const {token} = req.query

//     Student.findOne({ emailToken: token })
//         .then( student => {
//             if(!student) {
//                 return res.status(422).json({error: "Token is invalid, pls contact us for assistance"})
//             }
//             student.emailToken = null
//             student.isVerified = true
//             student.save().then( stud =>{
//                 res.json({message:`Welcome to Firstclassbrain ${stud.firstName}`})
//             })
//         } )

// })

console.log(moment().format('L'))

// router.get('/courses', requireStudentLogin, (req, res) => {

//     Student.findOne(req.student._id)
//         .then( student => {

//             //  check date

//             //  Then check if there's enough fund

//             //  Display the course

            
//         } )
    

// })

router.post('/signup-student', (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone,
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
    if(!firstName || !lastName || !email || !phone || !address || !classSelected || !password){
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
                        emailToken: crypto.randomBytes(64).toString('hex'),
                        isVerified: false
                    })
                    student.save()
                        .then(student => {

                            let mailOptions =  {
                                to:student.email,
                                from:'"Firstclassbrain" <password@firstclassbrain.com>',
                                subject:"Confirm Your Email Address",
                                html: `
                                <html>
                                    <head>
                                        <meta charset="utf-8">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
                                    </head>
                                    <body style="background: #f5f5f0; padding: 2em; font-family: 'Montserrat', sans-serif; margin: 0;">
                                        <div style="background: #fff; border-radius: 15px;">
                                            <div style="background: #008080; height:2.5em; border-radius: 15px 15px 0px 0px;"></div>
                                            <div style="display: flex; align-items: center; padding: 2em 2em 0em 2em;">
                                                <img src="https://firstclassbrain.com/static/media/logo.08b1aa39.jpeg" width="50px" alt="Logo">
                                                <span style="font-size: 18px; font-weight: 600; text-transform: uppercase; padding-left: 10px;">First Class Brain</span>
                                            </div>
                                            <div style="padding: 2em 2em; border-radius: 10px;">
                                                <p>Hi ${student.firstName}</p>
                                                <p>Thanks for registering on our site. <br /> Please confirm your email address, by clicking on the link below!</p>
                                                <a href="https://firstclassbrain.com/verify-email/student?token=${student.emailToken}">Confirm email...</a>
                                            </div>
                                            <div style="background: #008080; height:2.5em; border-radius: 0px 0px 15px 15px;"></div>
                                        </div>
                                        <footer style="text-align: center; font-size: 9px; padding: 1em 0em 3em 0em;">
                                            <p>&copy; 2020, All rights reserved</p>
                                            <p>No. 27, Olayiwola Street, New Oko-oba, Lagos State</p>
                                        </footer>
                                    </body> 
                                </html>
                                `
                            }
            
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.log(error)
                                    return res.status(422).json(error)
                                } else {
                                    console.log('Email sent: ' + info.response)
                                    res.json({message:"Thanks for registering, please check your email to verify your account..."})
                                }
                            })

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
                            classSelected,
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
                            classSelected,
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

// router.post('/verify/pay-basic-one/:reference', (req,res) => {

//     // const {reference} = req.params

//     // var mainres = res

//     // router.get( `https://api.paystack.co/transaction/verify/${reference}`, (req,res) => {
//     //     if(!res) {
//     //         return mainres.json({err: "Error"})
//     //     }
//     //     mainres.json({data: res.data})
//     // })

//     var varDate = new Date(01-10-2021)
//     var today = new Date();

//     console.log(varDate.getFullYear())
//     console.log(today)




// })

router.post("/pay-basic-one", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { one:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-two", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { two:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-three", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { three:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-four", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { four:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-five", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { five:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-six", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { six:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-seven", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { seven:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-eight", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { eight:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-nine", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { nine:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-ten", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { ten:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-eleven", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { eleven:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-twelve", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { twelve:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-thirteen", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { thirteen:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-fourteen", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { fourteen:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-fifteen", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { fifteen:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-sixteen", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { sixteen:  "true" }, {useFindAndModify: false},   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})

router.post("/pay-basic-seventeen", requireStudentLogin, (req,res) => {   
    Student.findByIdAndUpdate(req.student._id, { seventeen:  "true" }, {useFindAndModify: false},   
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
        phone,
        email,
        pic,
        password
    } = req.body
    if(!firstName || !lastName || !phone || !email || !password){
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
                        phone,
                        email,
                        pic,
                        password: hashedPassword,
                        emailToken: crypto.randomBytes(64).toString('hex'),
                        isVerified: false
                    })
                    instructor.save()
                        .then(instructor => {

                            let mailOptions =  {
                                to:instructor.email,
                                from:'"Firstclassbrain" <password@firstclassbrain.com>',
                                subject:"Confirm Your Email Address",
                                html: `
                                <html>
                                    <head>
                                        <meta charset="utf-8">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
                                    </head>
                                    <body style="background: #f5f5f0; padding: 2em; font-family: 'Montserrat', sans-serif; margin: 0;">
                                        <div style="background: #fff; border-radius: 15px;">
                                            <div style="background: #008080; height:2.5em; border-radius: 15px 15px 0px 0px;"></div>
                                            <div style="display: flex; align-items: center; padding: 2em 2em 0em 2em;">
                                                <img src="https://firstclassbrain.com/static/media/logo.08b1aa39.jpeg" width="50px" alt="Logo">
                                                <span style="font-size: 18px; font-weight: 600; text-transform: uppercase; padding-left: 10px;">First Class Brain</span>
                                            </div>
                                            <div style="padding: 2em 2em; border-radius: 10px;">
                                                <p>Hi ${instructor.firstName}</p>
                                                <p>Thanks for registering on our site. <br /> Please confirm your email address, by clicking on the link below!</p>
                                                <a href="https://firstclassbrain.com/verify-email/instructor?token=${instructor.emailToken}">Confirm email...</a>
                                            </div>
                                            <div style="background: #008080; height:2.5em; border-radius: 0px 0px 15px 15px;"></div>
                                        </div>
                                        <footer style="text-align: center; font-size: 9px; padding: 1em 0em 3em 0em;">
                                            <p>&copy; 2020, All rights reserved</p>
                                            <p>No. 27, Olayiwola Street, New Oko-oba, Lagos State</p>
                                        </footer>
                                    </body> 
                                </html>
                                `
                            }
            
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.log(error)
                                    return res.status(422).json(error)
                                } else {
                                    console.log('Email sent: ' + info.response)
                                    res.json({message:"Thanks for registering, please check your email to verify your account..."})
                                }
                            })
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

router.get('/verify-email/instructor', (req, res) => {
    const {token} = req.query

    Instructor.findOne({ emailToken: token })
        .then( instructor => {
            if(!instructor) {
                return res.status(422).json({error: "Token is invalid, pls contact us for assistance"})
            }
            instructor.emailToken = null
            instructor.isVerified = true
            instructor.save().then( inst =>{
                res.json({message:`Welcome to Firstclassbrain ${inst.firstName}`})
            })
        } )

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
                        emailToken: crypto.randomBytes(64).toString('hex'),
                        isVerified: false
                    })
                    admin.save()
                        .then(admin => {
                            let mailOptions =  {
                                to:admin.email,
                                from:'"Firstclassbrain" <password@firstclassbrain.com>',
                                subject:"Confirm Your Email Address",
                                html: `
                                <html>
                                    <head>
                                        <meta charset="utf-8">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
                                    </head>
                                    <body style="background: #f5f5f0; padding: 2em; font-family: 'Montserrat', sans-serif; margin: 0;">
                                        <div style="background: #fff; border-radius: 15px;">
                                            <div style="background: #008080; height:2.5em; border-radius: 15px 15px 0px 0px;"></div>
                                            <div style="display: flex; align-items: center; padding: 2em 2em 0em 2em;">
                                                <img src="https://firstclassbrain.com/static/media/logo.08b1aa39.jpeg" width="50px" alt="Logo">
                                                <span style="font-size: 18px; font-weight: 600; text-transform: uppercase; padding-left: 10px;">First Class Brain</span>
                                            </div>
                                            <div style="padding: 2em 2em; border-radius: 10px;">
                                                <p>Hi ${admin.firstName}</p>
                                                <p>Thanks for registering on our site. <br /> Please confirm your email address, by clicking on the link below!</p>
                                                <a href="https://firstclassbrain.com/verify-email/admin?token=${admin.emailToken}">Confirm email...</a>
                                            </div>
                                            <div style="background: #008080; height:2.5em; border-radius: 0px 0px 15px 15px;"></div>
                                        </div>
                                        <footer style="text-align: center; font-size: 9px; padding: 1em 0em 3em 0em;">
                                            <p>&copy; 2020, All rights reserved</p>
                                            <p>No. 27, Olayiwola Street, New Oko-oba, Lagos State</p>
                                        </footer>
                                    </body> 
                                </html>
                                `
                            }
            
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.log(error)
                                    return res.status(422).json(error)
                                } else {
                                    console.log('Email sent: ' + info.response)
                                    res.json({message:"Thanks for registering, please check your email to verify your account..."})
                                }
                            })
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

router.get('/verify-email/admin', (req, res) => {
    const {token} = req.query

    Admin.findOne({ emailToken: token })
        .then( savedAdmin => {
            if(!savedAdmin) {
                return res.status(422).json({error: "Token is invalid, pls contact us for assistance"})
            }
            savedAdmin.emailToken = null
            savedAdmin.isVerified = true
            savedAdmin.save().then( admin =>{
                res.json({message:`Welcome to Firstclassbrain ${admin.firstName}`})
            })
        } )

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


// Reset password, both for admin, instructor and student

router.post('/admin/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        Admin.findOne({email:req.body.email})
        .then(admin=>{
            if(!admin){
                return res.status(422).json({error:"Admin dont exists with that email"})
            }
            admin.resetToken = token
            admin.expireToken = Date.now() + 3600000
            admin.save().then((result)=>{
                let mailOptions =  {
                    to:admin.email,
                    from:'"Firstclassbrain" <password@firstclassbrain.com>',
                    subject:"Password reset request",
                    text:   `You are receiving this because you (or someone else) have requested the reset of the password for your account.
                    Please click on the following link, or paste this into your browser to complete the process: http://firstclassbrain.com/reset/admin/${token}
                    If you did not request this, please ignore this email and your password will remain unchanged.`
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error)
                        return res.status(422).json(error)
                    } else {
                        console.log('Email sent: ' + info.response)
                        res.json({message:"check your email"})
                    }
                })
            })
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.post('/admin/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    Admin.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(admin=>{
        if(!admin){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           admin.password = hashedpassword
           admin.resetToken = undefined
           admin.expireToken = undefined
           admin.save().then((savedadmin)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/instructor/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        Instructor.findOne({email:req.body.email})
        .then(instructor=>{
            if(!instructor){
                return res.status(422).json({error:"Instructor dont exists with that email"})
            }
            instructor.resetToken = token
            instructor.expireToken = Date.now() + 3600000
            instructor.save().then((result)=>{
                let mailOptions =  {
                    to:instructor.email,
                    from:'"Firstclassbrain" <password@firstclassbrain.com>',
                    subject:"Password reset request",
                    text:   `You are receiving this because you (or someone else) have requested the reset of the password for your account.
                    Please click on the following link, or paste this into your browser to complete the process: http://firstclassbrain.com/reset/instructor/${token}
                    If you did not request this, please ignore this email and your password will remain unchanged.`
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error)
                        return res.status(422).json(error)
                    } else {
                        console.log('Email sent: ' + info.response)
                        res.json({message:"check your email"})
                    }
                })
            })
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.post('/instructor/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    Instructor.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(instructor=>{
        if(!instructor){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           instructor.password = hashedpassword
           instructor.resetToken = undefined
           instructor.expireToken = undefined
           instructor.save().then((savedinstructor)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/student/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
                
        const token = buffer.toString("hex")
        Student.findOne({email:req.body.email})
        .then(student=>{
            if(!student){
                return res.status(422).json({error:"Student dont exists with that email"})
            }
            student.resetToken = token
            student.expireToken = Date.now() + 3600000
            student.save().then((result)=>{

                let mailOptions =  {
                    to:student.email,
                    from:'"Firstclassbrain" <password@firstclassbrain.com>',
                    subject:"Password reset request",
                    text:   `You are receiving this because you (or someone else) have requested the reset of the password for your account.
                    Please click on the following link, or paste this into your browser to complete the process: http://firstclassbrain.com/reset/student/${token}
                    If you did not request this, please ignore this email and your password will remain unchanged.`
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error)
                        return res.status(422).json(error)
                    } else {
                        console.log('Email sent: ' + info.response)
                        res.json({message:"check your email"})
                    }
                })
                
            })

        }).catch(err=>{
            console.log(err)
        })
    })
})

router.post('/student/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    Student.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(student=>{
        if(!student){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           student.password = hashedpassword
           student.resetToken = undefined
           student.expireToken = undefined
           student.save().then((savedstudent)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/contact', (req,res) => {
    const { first_name, last_name, phone_number, email, message } = req.body
    if( !first_name || !last_name || !phone_number || !email || !message ){
        return res.status(422).json({error: "Please add all the fields"})
    }

    const contact = new Contact({
        first_name,
        last_name, 
        phone_number,
        email, 
        message,
    })

    let mailOptions =  {
        to:'wisdomanaba83@gmail.com',
        from: '"Team Firstclassbrain" <password@firstclassbrain.com>',
        subject:`Contact Form: Message from ${first_name.charAt(0).toUpperCase() + first_name.slice(1)} ${last_name.charAt(0).toUpperCase() + last_name.slice(1)}`,
        html: `
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet">
                </head>
                <body style="background: #f5f5f0; padding: 2em; font-family: 'Montserrat', sans-serif; margin: 0;">
                    <div style="background: #fff; border-radius: 15px;">
                        <div style="background: #008080; height:2.5em; border-radius: 15px 15px 0px 0px;"></div>
                        <div style="display: flex; align-items: center; padding: 2em 2em 0em 2em;">
                            <img src="https://firstclassbrain.com/static/media/logo.08b1aa39.jpeg" width="50px" alt="Logo">
                            <span style="font-size: 18px; font-weight: 600; text-transform: uppercase; padding-left: 10px;">First Class Brain</span>
                        </div>
                        <div style="padding: 2em 2em; border-radius: 10px;">
                            <p><strong>Name:</strong> ${first_name.charAt(0).toUpperCase() + first_name.slice(1)} ${last_name.charAt(0).toUpperCase() + last_name.slice(1)}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Phone no:</strong> ${phone_number}</p>
                            <p><strong>Message:</strong> ${message}</p>
                        </div>
                        <div style="background: #008080; height:2.5em; border-radius: 0px 0px 15px 15px;"></div>
                    </div>
                    <footer style="text-align: center; font-size: 9px; padding: 1em 0em 3em 0em;">
                        <p>&copy; 2020, All rights reserved</p>
                        <p>No. 27, Olayiwola Street, New Oko-oba, Lagos State</p>
                    </footer>
                </body> 
            </html>
            `
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            return res.status(422).json(error)
        } else {
            contact.save()
                .then(message => {
                    console.log('Email sent: ' + info.response)
                    res.json({message: "Messaeg sent successfully", data: message})
                })
                .catch(err => {
                    res.json({err})
                    console.log(err)
                })
        }
    })
    
})

router.put('/updatepic/admin',requireStudentLogin,(req,res)=>{

    const { pic } = req.body

    Admin.findByIdAndUpdate(req.admin._id,{$set:{pic}},{new:true},
        (err,result)=>{
            if(err){
                return res.status(422).json({error:"Picture cannot post"})
            }
            res.json({message:"Record has been Updated..!!", result})
    })
})

router.put('/updatepic/instructor',requireStudentLogin,(req,res)=>{

    const { pic } = req.body

    Instructor.findByIdAndUpdate(req.instructor._id,{$set:{pic}},{new:true},
        (err,result)=>{
            if(err){
                return res.status(422).json({error:"Picture cannot post"})
            }
            res.json({message:"Record has been Updated..!!", result})
    })
})

router.put('/updatepic/student',requireStudentLogin,(req,res)=>{

    const { pic } = req.body

    Student.findByIdAndUpdate(req.student._id,{$set:{pic}},{new:true},
        (err,result)=>{
            if(err){
                return res.status(422).json({error:"Picture cannot post"})
            }
            res.json({message:"Record has been Updated..!!", result})
    })
})


router.put('/settings',requireStudentLogin,(req,res)=>{

    const { classSelected } = req.body

    Student.findByIdAndUpdate(req.student._id,{$set:{classSelected}},{new:true},
        (err,result)=>{
            if(err){
                return res.status(422).json({error:"Pls try again, an error occurred..!!"})
            }
            res.json({message:"Class updated successfully..!!", result})
    })
})

module.exports = router
