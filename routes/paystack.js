const express = require('express')
const request = require('request')
const mongoose = require('mongoose')
const moment = require('moment')

const router = express.Router()

const requireStudentLogin = require('../middleware/requireStudentLogin')

const Student = mongoose.model("Student")
const Post = mongoose.model("Post")

const {verifyPayment, charge_authorization} = require('../config/paystack')(request)


router.post('/verify/payment/:reference', (req,res) => {

    const {reference} = req.params

    verifyPayment(reference, (error,body)=>{

        if(error){
            //handle errors appropriately
            console.log(error)
            return res.status(422).json({error})
        }

        response = JSON.parse(body)
        
        if (response.status === false) {
            return res.status(422).json({error: "Bad request, check internet connectivity and try again..."})
        }

        const email = response.data.customer.email

        const payRef = response.data.reference

        const { authorization_code, card_type, last4, exp_month, exp_year, bin, bank, channel, signature, reusable, country_code } = response.data.authorization

        Student.findOne({email})
            .select("-password")
            .then(student=>{
                if(!student){
                    return res.status(422).json({error:"User not a student..."})
                }


                student.expiryDate = moment().add(7, 'days').calendar()
                student.paid = true
                student.paymentReference = payRef
                student.bankAuth =  { authorization_code, card_type, last4, exp_month, exp_year, bin, bank, channel, signature, reusable, country_code }
                student.save().then((savedstudent)=>{
                       res.json({message:"Paid succesfully...", savedstudent: savedstudent})
                })

                console.log(student)
            })
            .catch((err) => console.log(err))

        // var mydate = new Date('2020-11-16T23:00:00.000Z');
        // console.log(mydate.toDateString());
            
        const newdate = new Date(moment().add(6, 'days').calendar());

        res.json({data: response}) 
        console.log(email)
        console.log(payRef)
        console.log(newdate.toDateString())
        console.log(response.data.authorization)

    })


    // var varDate = new Date(01-10-2021)
    // var today = new Date();

    // console.log(varDate.getFullYear())
    // console.log(today)


})

router.get('/studentcourse', requireStudentLogin, (req, res) => {

    // var GivenDate = 'Tue Nov 10 2020';
    // var CurrentDate = new Date();
    // GivenDate = new Date(GivenDate);

    // if(GivenDate > CurrentDate){
    //     alert('Given date is greater than the current date.');
    // }else{
    //     alert('Given date is not greater than the current date.');
    // }


    Student.findById(req.student._id)
        .select("-password")
        .then(stud => {

            var GivenDate = 'Tue Nov 10 2020'
            // var GivenDate = stud.expiryDate
            var CurrentDate = new Date()
            GivenDate = new Date(GivenDate)

            if(GivenDate < CurrentDate){
                const params = JSON.stringify({
                    "authorization_code" : stud.bankAuth.authorization_code,
                    "email" : stud.email,
                    "amount" : 1000000
                })
                charge_authorization(params, (error,body) => {

                    if(error){
                        //handle errors appropriately
                        stud.paid = false
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
                    stud.paid = true
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
                    
                    // res.json({message:"Given date is greater than the current date.", data: response})

                })
                // res.json({message:"Given date is greater than the current date.", params})
            }else{
                Post.find()
                    .populate("postedBy", "_id firstName")
                    .populate("comments.postedBy", "_id firstName")
                    .then(posts => {
                        res.json({posts, message:"Given date is not greater than the current date."})
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }

        })
        .catch((err) => console.log(err))

})

// router.post('/pay', (req, res) => {

//     const {first_name,last_name,amount,email} = req.body

//     if(!first_name || !last_name || !amount || !email ){
//         return res.status(422).json({error:"please add all the fields"})
//      }

//     var form = {first_name,last_name,amount,email}
//     form.amount *= 100

//     console.log(form)

//     initializePayment(form, (error, body)=>{
//         if(error){
//             //handle errors
//             console.log(error);
//             return res.status(422).json({error})
//         }
//         response = JSON.parse(body)
//         console.log(response)
//         res.json({url: response.data.authorization_url})
//         verifyPayment(response.data.reference, (error,body)=>{
//             if(error){
//                 //handle errors appropriately
//                 console.log(error)
//                 return res.status(422).json({error})
//             }
//             response = JSON.parse(body)    
//             console.log(response)
//             const { reference, amount, customer } = response.data
    
//             const donor = new Donor({
//                 full_name: metadata.full_name,
//                 email: customer.email,
//                 amount: amount,
//                 reference: reference
//             })
//             donor.save().then(donor=>{
//                 res.json({id:donor._id})
//             }).catch(err=>{
//                 console.log(err)
//             })
//         })
//     })
// })


// router.get('/studentcourse', requireStudentLogin, (req, res) => {
//     const ref = req.query.reference;
//     verifyPayment(ref, (error,body)=>{
//         if(error){
//             //handle errors appropriately
//             console.log(error)
//             return res.status(422).json({error})
//         }
//         response = JSON.parse(body)    
//         console.log(response)
//         const { reference, amount, customer, metadata } = response.data

//         const donor = new Donor({
//             first_name: customer.first_name,
//             last_name: customer.last_name,
//             email: customer.email,
//             amount: amount,
//             reference: reference
//         })
//         donor.save().then(donor=>{
//             res.json({id:donor._id})
//         }).catch(err=>{
//             console.log(err)
//         })
//     })
// })

module.exports = router