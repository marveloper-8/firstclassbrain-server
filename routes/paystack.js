const express = require('express')
const request = require('request')
const router = express.Router()

const requireStudentLogin = require('../middleware/requireStudentLogin')

const {verifyPayment} = require('../config/paystack')(request)


// const Donor = require('../models/Donor')

router.post('/verify/pay-basic-one/:reference', requireStudentLogin, (req,res) => {

    const {reference} = req.params

    verifyPayment(reference, (error,body)=>{
        if(error){
            //handle errors appropriately
            console.log(error)
            return res.status(422).json({error})
        }
        response = JSON.parse(body)
        res.json({data: response.data}) 
        console.log(response)


        // Saving to database

        // const { reference, amount, customer } = response.data

        // const donor = new Donor({
        //     full_name: metadata.full_name,
        //     email: customer.email,
        //     amount: amount,
        //     reference: reference
        // })
        // donor.save().then(donor=>{
        //     res.json({id:donor._id})
        // }).catch(err=>{
        //     console.log(err)
        // })

    })


    // var varDate = new Date(01-10-2021)
    // var today = new Date();

    // console.log(varDate.getFullYear())
    // console.log(today)


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

// router.get('/callback', (req, res) => {
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