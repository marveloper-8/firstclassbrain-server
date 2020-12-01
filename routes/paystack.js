const express = require('express')
const request = require('request')
const mongoose = require('mongoose')
const moment = require('moment')
const cron = require('node-cron')

const router = express.Router()

const requireStudentLogin = require('../middleware/requireStudentLogin')

const Student = mongoose.model("Student")
const Post = mongoose.model("Post")

const {verifyPayment, charge_authorization} = require('../config/paystack')(request)

router.post('/verify/payment/monthly/:reference', (req,res) => {

    const {reference} = req.params

    verifyPayment(reference, (error,body)=>{

        if(error){
            console.log(error)
            return res.status(422).json({error})
        }

        response = JSON.parse(body)

        if (response.status === false) {
            return res.status(422).json({error: "Bad request, check internet connectivity and try again..."})
        }

        const email = response.data.customer.email

        // const { authorization_code, card_type, last4, exp_month, exp_year, bin, bank, channel, signature, reusable, country_code } = response.data.authorization
        const { authorization_code } = response.data.authorization

        Student.findOne({email})
            .then(student=>{
                if(!student){
                    return res.status(422).json({error:"User not a student..."})
                }

                student.expiryDate = moment().add(29, 'days').calendar()
                student.paid = 'true'
                student.paymentReference = reference
                student.bankAuth =  { authorization_code }
                student.save().then((savedstudent)=>{
                       res.json({message:"Paid succesfully...", savedstudent, response})
                })

                console.log(student)
            })
            .catch((err) => console.log(err))

        // var mydate = new Date('2020-11-16T23:00:00.000Z')
        // console.log(mydate.toDateString())
    })

})


router.post('/verify/payment/quarterly/:reference', (req,res) => {

    const {reference} = req.params

    verifyPayment(reference, (error,body)=>{

        if(error){
            console.log(error)
            return res.status(422).json({error})
        }

        response = JSON.parse(body)

        if (response.status === false) {
            return res.status(422).json({error: "Bad request, check internet connectivity and try again..."})
        }

        const email = response.data.customer.email

        // const { authorization_code, card_type, last4, exp_month, exp_year, bin, bank, channel, signature, reusable, country_code } = response.data.authorization
        const { authorization_code } = response.data.authorization

        Student.findOne({email})
            .then(student=>{
                if(!student){
                    return res.status(422).json({error:"User not a student..."})
                }

                student.expiryDate = moment().add(89, 'days').calendar()
                student.paid = 'true'
                student.paymentReference = reference
                student.bankAuth =  { authorization_code }
                student.save().then((savedstudent)=>{
                       res.json({message:"Paid succesfully...", savedstudent: savedstudent})
                })

                console.log(student)
            })
            .catch((err) => console.log(err))

        // var mydate = new Date('2020-11-16T23:00:00.000Z')
        // console.log(mydate.toDateString())
    })

})

router.post('/verify/payment/biannually/:reference', (req,res) => {

    const {reference} = req.params

    verifyPayment(reference, (error,body)=>{

        if(error){
            console.log(error)
            return res.status(422).json({error})
        }

        response = JSON.parse(body)

        if (response.status === false) {
            return res.status(422).json({error: "Bad request, check internet connectivity and try again..."})
        }

        const email = response.data.customer.email

        // const { authorization_code, card_type, last4, exp_month, exp_year, bin, bank, channel, signature, reusable, country_code } = response.data.authorization
        const { authorization_code } = response.data.authorization

        Student.findOne({email})
            .then(student=>{
                if(!student){
                    return res.status(422).json({error:"User not a student..."})
                }

                student.expiryDate = moment().add(181, 'days').calendar()
                student.paid = 'true'
                student.paymentReference = reference
                student.bankAuth =  { authorization_code }
                student.save().then((savedstudent)=>{
                       res.json({message:"Paid succesfully...", savedstudent: savedstudent})
                })

                console.log(student)
            })
            .catch((err) => console.log(err))

        // var mydate = new Date('2020-11-16T23:00:00.000Z')
        // console.log(mydate.toDateString())
    })

})

router.post('/verify/payment/annually/:reference', (req,res) => {

    const {reference} = req.params

    verifyPayment(reference, (error,body)=>{

        if(error){
            console.log(error)
            return res.status(422).json({error})
        }

        response = JSON.parse(body)

        if (response.status === false) {
            return res.status(422).json({error: "Bad request, check internet connectivity and try again..."})
        }

        const email = response.data.customer.email

        // const { authorization_code, card_type, last4, exp_month, exp_year, bin, bank, channel, signature, reusable, country_code } = response.data.authorization
        const { authorization_code } = response.data.authorization

        Student.findOne({email})
            .then(student=>{
                if(!student){
                    return res.status(422).json({error:"User not a student..."})
                }

                student.expiryDate = moment().add(364, 'days').calendar()
                student.paid = 'true'
                student.paymentReference = reference
                student.bankAuth =  { authorization_code }
                student.save().then((savedstudent)=>{
                       res.json({message:"Paid succesfully...", savedstudent: savedstudent})
                })

                console.log(student)
            })
            .catch((err) => console.log(err))

        // var mydate = new Date('2020-11-16T23:00:00.000Z')
        // console.log(mydate.toDateString())
    })

})

// cron.schedule('1 * * * * *', () => {
//     console.log('Running Cron Job')

//     // var GivenDate = 'Tue Nov 18 2020';
//     // var CurrentDate = new Date();
//     // GivenDate = new Date(GivenDate);

//     // if(GivenDate > CurrentDate){
//     //     console.log('Given date is greater than the current date.')
//     //     Give course
//     // }else{
//     //     console.log('Given date is not greater than the current date.')
//     //     Charge again
//     // }


//     var GivenDate = 'Tue Nov 10 2020'
//     // var GivenDate = stud.expiryDate
//     var CurrentDate = new Date()
//     GivenDate = new Date(GivenDate)

//     // Student.find()
//     //     .then(student => {
//     //         student.map( i => console.log(i.bankAuth) )
//     //     })
//     //     .catch(err => {
//     //         console.log(err)
//     //     })
// })

router.get('/studentcourse', requireStudentLogin, (req, res) => {

    // var GivenDate = 'Tue Nov 18 2020';
    // var CurrentDate = new Date();
    // GivenDate = new Date(GivenDate);

    // if(GivenDate > CurrentDate){
    //     console.log('Given date is greater than the current date.')
    //     Give course
    // }else{
    //     console.log('Given date is not greater than the current date.')
    //     Charge again
    // }


    Student.findById(req.student._id)
        .select("-password")
        .then(stud => {

            // var GivenDate = 'Tue Nov 10 2020'
            var GivenDate = stud.expiryDate
            var CurrentDate = new Date()
            GivenDate = new Date(GivenDate)

            if(GivenDate > CurrentDate){
                Post.find()
                    .populate("postedBy", "_id firstName")
                    .populate("comments.postedBy", "_id firstName")
                    .then(posts => {
                        res.json({posts, message:"Given date is not greater than the current date."})
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }else{
                const params = JSON.stringify({
                    "authorization_code" : stud.bankAuth.authorization_code,
                    "email" : stud.email,
                    "amount" : 1000000
                })
                charge_authorization(params, (error,body) => {

                    if(error){
                        //handle errors appropriately
                        stud.paid = 'false'
                        stud.save()
                        console.log(error)
                        return res.status(422).json({error, message: 'Subscription expired you need to pay again'})
                    }
         
                    response = JSON.parse(body)

                    if (response.status === false) {
                        stud.paid = false
                        stud.save()
                        return res.status(422).json({error: "Bad request. please, check internet connectivity and try again...", message: 'Subscription expired you need to pay again'})
                    }

                    stud.expiryDate = moment().add(7, 'days').calendar()
                    stud.paid = 'true'
                    stud.paymentReference = response.data.reference
                    stud.save()

                    Post.find()
                    .populate("postedBy", "_id firstName")
                    .populate("comments.postedBy", "_id firstName")
                    .then(posts => {
                        res.json({ message:"All is cool.", posts })
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    
                })
            }

        })
        .catch((err) => console.log(err))

})

var named = new Date('2020-12-16T23:00:00.000Z')
console.log(named.toDateString())

module.exports = router