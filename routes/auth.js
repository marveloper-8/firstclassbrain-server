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
const Test = mongoose.model("Test")

const { Contact } = require('../models/contact')


const requireStudentLogin = require('../middleware/requireStudentLogin')
const requireAdminLogin = require('../middleware/requireAdminLogin')

const {EMAIL,CONTACT_EMAIL ,PASSWORD, MAILHOST, JWT_SECRET} = require('../config/keys')

const nodemailer = require('nodemailer')

var passwordTransporter = nodemailer.createTransport({
    host: MAILHOST,
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

// var transporter = nodemailer.createTransport({
//     host: 'firstclassbrain.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: 'contact@firstclassbrain.com',
//       pass: 'Firstclassbrain23456'
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// })

// transporter.verify(function(error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// })

// router.post('/contact-form', (req, res) => {
//   const { 
//       first_name, 
//       last_name, 
//       email, 
//       phone,
//       message
//     } = req.body

//   const sendMail = async () => {
//     try{
      
//       let mailOptions = {
//         from: `"Contact Form Message" <contact@firstclassbrain.com>`,
//         to: `g.joshua.e@gmail.com`,
//         subject: `${first_name} has a message for you`,
//         text: `Message from ${first_name}`,
//         html: `
//             <p>My name is <strong>${first_name} ${last_name}</strong> and I just want to say <strong>${message}</strong></p>

//             <p>Send me an email at ${email} or call me on ${phone}</p>
//         `
//       }

//       transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//           res.json(error)
//           console.log(error)
//         }
//         console.log('Email sent: ' + info.response)
//       })

//     }catch(err){
//       res.json(err)
//       console.log(err)
//     }
//   }

//   sendMail()

// })

// router.post('/contact', (req,res) => {
//     const { first_name, last_name, phone_number, email, message } = req.body
//     if( !first_name || !last_name || !phone_number || !email || !message ){
//         return res.status(422).json({error: "Please add all the fields"})
//     }

//     const name = `${first_name.charAt(0).toUpperCase() + first_name.slice(1)} ${last_name.charAt(0).toUpperCase() + last_name.slice(1)}`

//     let mailOptions =  {
//         to: 'wisdomanaba83@gmail.com',
//         from: email,
//         subject:`Contact Form: Message from ${name}`,
//         text: `Name: ${name}
//         Email: ${email}
//         Phone no: ${phone_number}
//         Message: ${message}
//         `
//     }

//     contactTransporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log(error)
//             return res.status(422).json({error})
//         } else {
//             contact.save()
//                 .then(message => {
//                     console.log('Email sent: ' + info.response)
//                     res.json({message: "Messaeg sent successfully", data: message})
//                 })
//                 .catch(err => {
//                     res.json({err})
//                     console.log(err)
//                 })
//         }
//     })
    
// })


router.post('/verify-email/student', (req, res) => {
    const {token} = req.body

    Student.findOne({ emailToken: token })
        .then( student => {
            if(!student) {
                return res.status(422).json({error: "Token is invalid, pls contact us for assistance"})
            }
            student.emailToken = null
            student.isVerified = "true"
            student.save().then( stud =>{
                res.json({message:`Welcome to Firstclassbrain ${stud.firstName}`})
            })
        } )

})

console.log(moment().format('L'))

console.log(moment().add(7, 'days').calendar())


router.post('/signup-student', (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        address,
        classSelected,
        pic,
        originalPassword,
        password
    } = req.body
    if(!firstName || !lastName || !email || !phone || !address || !classSelected || !password || !originalPassword){
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
                        originalPassword,
                        password: hashedPassword,
                        emailToken: crypto.randomBytes(64).toString('hex'),
                        isVerified: "false"
                    })
                    student.save()
                        .then(student => {

                            let mailOptions =  {
                                from:'"Firstclassbrain" <password@firstclassbrain.com>',
                                to:student.email,
                                subject:"Confirm Your Email Address",
                                html: `
                                <!DOCTYPE html>
                                <html lang="en"
                                xmlns="http://www.w3.org/1999/xhtml" 
                                xmlns:v="urn:schemas-microsoft-com:vml" 
                                xmlns:o="urn:schemas-microsoft-com:office:office"
                                >
                                <head>
                                        <meta charset="UTF-8">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <title>Document</title>

                                        <!-- <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> -->
                                        <!--[if !mso]><!-- -->
                                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                        <!--<![endif]-->
                                        <!--[if gte mso 9]><xml>
                                        <o:OfficeDocumentSettings>
                                        <o:AllowPNG/>
                                        <o:PixelsPerInch>96</o:PixelsPerInch>
                                        </o:OfficeDocumentSettings>
                                        </xml><![endif]-->


                                        <style>
                                            h1,.h1{
                                            font-size: 60px !important;
                                            line-height: 66px !important;
                                            }
                                            h2,.h2{
                                            font-size: 44px !important;
                                            line-height: 50px !important;
                                            }
                                            .btn a:hover{
                                            background-color:#000000!important;
                                            border-color:#000000!important;
                                            }
                                            .textcta a:hover{
                                            color:#000000!important;
                                            }
                                            p {margin: 0 !important;}
                                            .divbox:hover, * [lang~="x-divbox"]:hover {
                                            background-color: #000000 !important;
                                            }
                                            .boxfont:hover, * [lang~="x-boxfont"]:hover {
                                            color: #ffffff !important;
                                            }

                                            .mobileContent{display: none;}

                                            @media (max-width: 414px) {
                                            .mobileContent{display: block !important}
                                            .desktopContent{display: none !important}
                                            .mob2_m_pad{padding-bottom: 15px !important}

                                            .hide {display: none !important;}
                                            .show {display: inline-block !important; width:auto !important; height:auto !important; overflow:visible !important; float:none !important; visibility:visible !important; border:none !important; padding-bottom:0px !important; vertical-align: bottom !important;}
                                            .show1 {
                                                    display: block !important;
                                                    max-height: none !important;
                                            }
                                            h1, h2, .h1, .h2{
                                                    font-size: 34px !important;
                                                    line-height: 40px !important;
                                            }
                                            .mobfb414, .mobfb414 td{
                                                    padding-left:0 !important;
                                                    padding-right:0 !important;
                                                    max-width:414px !important;
                                            }
                                            .mobmw414{
                                                    max-width:414px !important;
                                            }
                                            }
                                        </style>

                                        <style type="text/css"> 
                                        @media screen and (max-width:699px){.full,.t10of12,.t11of12,.t12of12,.t1of12,.t2of12,.t3of12,.t4of12,.t5of12,.t6of12,.t7of12,.t8of12,.t9of12{width:100%!important;max-width:none!important}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}.headerTextLeft{text-align:left!important}.hide{display:none!important}.mp0{padding:0!important}}@font-face{font-family:UberMove-Medium;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMove-Medium.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMove-Medium.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Light;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Light.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Light.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Regular;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Regular.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Regular.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Medium;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Medium.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Medium.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Bold;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Bold.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Bold.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}
                                        </style>
                                </head>
                                <body dir="ltr" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#d6d6d5;margin:0;min-width:100%;padding:0;width:100%">
                                        <span data-blockuuid="ab2f7a3a-54b3-4956-8fcc-02b837adf583" style="display: none; max-height: 0px; font-size: 0px; overflow: hidden; mso-hide: all;">
                                        Get familiar with useful features like Spotlight and Share My Trip.
                                        </span>
                                        
                                        <style>.yahooHide{display:none!important}</style>
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#d6d6d5;border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0" bgcolor="#d6d6d5" class="">
                                        <tbody>
                                        <tr>
                                        <td align="center" style="display: block;">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table width="700" align="center" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                        <td>
                                        <![endif]-->
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;border-spacing:0;max-width:700px;mso-table-lspace:0;mso-table-rspace:0" class="">
                                        <tbody>
                                        <tr>
                                        <td style="background-color:#ffffff">
                                        
                                        <!-- mod1  mt_2019/10/23  -->
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" data-blockuuid="bb61e9fc-ef96-4b2d-8311-5e8804baa199">
                                            <tbody><tr>
                                            <td class="" align="left" style="direction:ltr;text-align:left;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                                                    <tbody><tr>
                                                    <td class="mob_bg" valign="top" background="https://s3-us-west-2.amazonaws.com/uber-common-public/svc-ugdb/82bac177-a494-410c-a1e7-35abca6689e2_HDGIF2_700x260.gif" bgcolor="#000000" style="background-image:url('https://s3-us-west-2.amazonaws.com/uber-common-public/svc-ugdb/82bac177-a494-410c-a1e7-35abca6689e2_HDGIF2_700x260.gif');background-color: #000000; background-size: contain; background-position: bottom right; background-repeat: no-repeat;" align="center" height="180">
                                            <!--[if gte mso 9]>
                                                        <v:image xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block; width: 700px; height: 240px;" src="https://s3-us-west-2.amazonaws.com/uber-common-public/svc-ugdb/82bac177-a494-410c-a1e7-35abca6689e2_HDGIF2_700x260.gif" />
                                                        <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block;position: absolute; width: 700px; height: 260px;">
                                                        <v:fill  opacity="0%" color="#000000"  />
                                                        <v:textbox inset="0,0,0,0">
                                                        <![endif]-->
                                                        <div>
                                        
                                        
                                        
                                        <!-- content  mt_2019/10/23  -->
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                            <tbody><tr>
                                        
                                            <td width="14">&nbsp;</td>
                                        
                                            <td class="outsidegutter" align="left" style="direction:ltr;text-align:left;">
                                                <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                                                    <tbody><tr>
                                                    <td align="center">
                                        
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                            <td>
                                                <![endif]-->
                                                <table border="0" cellpadding="0" cellspacing="0" class="t10of12" align="center" style="border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                                    <tbody><tr>
                                                        <td width="12">&nbsp;</td>
                                                        <td style="direction:ltr;text-align:left;">
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                            <tbody><tr>
                                                                <td style="direction:ltr;text-align:left;">
                                        
                                        
                                                                </td>
                                                            </tr>
                                        
                                                            <tr>
                                                            <td valign="top" style="direction:ltr;text-align:left;">
                                        
                                                            </td>
                                                            </tr>
                                        
                                                        </tbody></table>
                                                        </td>
                                                        <td width="12">&nbsp;</td>
                                                    </tr>
                                                </tbody></table>
                                                <!--[if (gte mso 9)|(IE)]>
                                            </td>
                                            </tr>
                                        </table>
                                        <![endif]-->
                                                    </td>
                                        
                                        
                                                    </tr>
                                                </tbody></table>
                                            </td>
                                        
                                            <td width="14">&nbsp;</td>
                                            </tr>
                                        </tbody></table>
                                        <!-- close content -->
                                        
                                        
                                        
                                        
                                        
                                                        </div>
                                                        <!--[if gte mso 9]>
                                                        </v:textbox>
                                                        </v:fill>
                                                        </v:rect>
                                                        </v:image>
                                                        <![endif]-->
                                                    </td>
                                                    </tr>
                                                </tbody></table>
                                            </td>
                                            </tr>
                                        </tbody></table>
                                        <!-- close mod1 -->
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;border-spacing:0;margin:auto;max-width:700px;mso-table-lspace:0;mso-table-rspace:0" class="tron">
                                        <tbody>
                                        <tr>
                                        <td align="center">
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#fff;border:0;border-collapse:collapse;border-spacing:0;margin:auto;mso-table-lspace:0;mso-table-rspace:0" bgcolor="#ffffff" class="basetable">
                                        <tbody>
                                        <tr>
                                        <td align="center">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table width="700" align="center" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                        <td align="center">
                                        <![endif]-->
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" class="basetable" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0">
                                        <tbody>
                                        <tr>
                                        <td align="center" style="background-color:#ffffff">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="basetable" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0">
                                        <tbody>
                                        <tr>
                                        <td>
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                        <td>
                                        <![endif]-->
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" class="basetable" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0">
                                        <tbody>
                                        <tr>
                                        <td>
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                        <td>
                                        <![endif]-->
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0" class="">
                                        <tbody>
                                        <tr>
                                        <td>
                                        <!-- mod2 mt_2019/10/23  -->
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" data-blockuuid="fee9d07e-d14a-498f-9709-d1970a2a6c42">
                                            <tbody><tr>
                                            <td class="outsidegutter" align="left" style="direction:ltr;text-align:left;padding: 0 14px 0 14px;">
                                                <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                                                    <tbody><tr>
                                                        <td style="direction:ltr;text-align:left;">
                                        
                                        
                                        
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                            <td>
                                                <![endif]-->
                                                <table border="0" cellpadding="0" cellspacing="0" class="t10of12 layout" align="center" style="border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                                    <tbody><tr>
                                                        <td class="mob2_m_pad" style="direction:ltr;text-align:left;font-size: 1px; height: 1px; line-height: 1px; padding-bottom: 30px; padding-left: 0px !important; padding-right: 0px !important; padding-top: 30px;">
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                            <tbody><tr>
                                                                <td style="direction:ltr;text-align:left;font-size: 0;" valign="middle">
                                        
                                        
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table width="336" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;vertical-align:middle;">
                                            <tr>
                                            <td>
                                                <![endif]-->
                                                <table border="0" cellpadding="0" cellspacing="0" class="t6of12" style="border: none; border-collapse: collapse; border-spacing: 0; display: inline-block; max-width: 336px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: middle; width: 100%;">
                                                    <tbody><tr>
                                                        <td style="direction:ltr;text-align:left;padding-bottom: 10px; padding-left: 12px; padding-right: 12px; padding-top: 10px;">
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                            <tbody><tr>
                                                                <td class="h5" style="direction:ltr;text-align:left;color: #000000; font-family: 'UberMove-Medium', 'HelveticaNeue', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 30px; padding-bottom: 3px; padding-top: 7px;">Welcome!</td>
                                                            </tr>
                                                            <tr>
                                                            <td style="direction:ltr;text-align:left;">
                                        
                                        
                                        
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table width="280" align="left" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                            <td>
                                                <![endif]-->
                                                <table border="0" cellpadding="0" cellspacing="0" class="t5of12 layout" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; max-width: 280px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                                    <tbody><tr>
                                                        <td style="direction:ltr;text-align:left;font-size: 1px; height: 1px; line-height: 1px; padding-left: 0px !important; padding-right: 0px !important;">
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                            <tbody><tr>
                                                                <td class="p2" style="direction:ltr;text-align:left;color: #000000; font-family: 'UberMoveText-Regular', 'HelveticaNeue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 22px; padding-bottom: 12px; padding-top: 7px;"><p>Hello ${student.firstName}. You have successfully created an account on Firstclassbrain.<br /><br />
                                                                Your password current password is <b style="color:teal;">${student.originalPassword}</b>
                                                                <br /><br />
                                                                Verify your account by clicking on the link below. If you do not get redirected to the verify email page, copy the link and paste in your browser. 
                                                                <br /><br />
                                                                <a href="https://firstclassbrain.com/verify-account/${student.emailToken}">https://firstclassbrain.com/verify-account/${student.emailToken}</a>
                                                                <br /><br />
                                                                <a style="color:#f00">NOTE: Make sure to be logged into your account on the browser used for verification.</a></p>
                                        </td>
                                                            </tr>
                                                        </tbody></table>
                                                        </td>
                                                    </tr>
                                                </tbody></table>
                                                <!--[if (gte mso 9)|(IE)]>
                                            </td>
                                            </tr>
                                        </table>
                                        <![endif]-->
                                                            </td>
                                                            </tr>
                                                        </tbody></table>
                                                        </td>
                                                    </tr>
                                                </tbody></table>
                                                <!--[if (gte mso 9)|(IE)]>
                                            </td>
                                            </tr>
                                        </table>
                                        <![endif]-->
                                        
                                        
                                        
                                        <!--[if mso]></td>
                                        <td valign="top">
                                            <![endif]-->
                                        
                                        
                                        
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table width="224" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;vertical-align:middle;">
                                            <tr>
                                            <td>
                                                <![endif]-->
                                                <table border="0" cellpadding="0" cellspacing="0" class="t4of12" style="border: none; border-collapse: collapse; border-spacing: 0; display: inline-block; max-width: 224px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: middle; width: 100%;">
                                                    <tbody><tr>
                                                        <td class="desktopContent" style="direction:ltr;text-align:left;padding-bottom: 15px; padding-left: 12px; padding-right: 12px; padding-top: 15px;">
                                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                            <tbody><tr>
                                                                <td style="direction:ltr;text-align:left;">
                                                                <div class="desktopContent">
                                                                    <img src="https://extras.firstclassbrain.com/dashboard.jpg" width="200" height="" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-width: 200px; outline: none; text-decoration: none; width: 100%; border:20px teal solid;" border="0" alt="">
                                                                </div>
                                                                </td>
                                                            </tr>
                                                        </tbody></table>
                                                        </td>
                                                    </tr>
                                                </tbody></table>
                                                <!--[if (gte mso 9)|(IE)]>
                                            </td>
                                            </tr>
                                        </table>
                                        <![endif]-->
                                        
                                        
                                        
                                        
                                        
                                        
                                                                </td>
                                                            </tr>
                                                        </tbody></table>
                                                        </td>
                                                    </tr>
                                                </tbody></table>
                                                <!--[if (gte mso 9)|(IE)]>
                                            </td>
                                            </tr>
                                        </table>
                                        <![endif]-->
                                        
                                        
                                        
                                        
                                                        </td>
                                                    </tr>
                                                </tbody></table>
                                            </td>
                                            </tr>
                                        </tbody></table>
                                        
                                        <div class="mobileContent" style="display: none; mso-hide: all;">
                                        <img src="https://extras.firstclassbrain.com/dashboard.jpg" height="" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-width: 100%; outline: none; text-decoration: none; width: 100%; border-top:20px teal solid; border-bottom:20px teal solid; margin-bottom:20px;" border="0" alt="">
                                        </div>
                                        
                                        
                                        <!-- close mod2 mt_2019/10/23  -->
                                        </td>
                                        </tr>
                                        </tbody>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                        </td>
                                        </tr>
                                        </tbody>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                        </td>
                                        </tr>
                                        </tbody>
                                        </table>
                                        </td>
                                        </tr>
                                        </tbody>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                        </td>
                                        </tr>
                                        </tbody>
                                        </table>
                                        <!-- END LIST-->
                                        </td>
                                        </tr>
                                        <!-- END BODY-->
                                        </tbody>
                                        </table>
                                        <!-- footer update july 31 2019  cf    -->
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #000000; border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" data-blockuuid="be0d7749-5ff0-40a5-834d-5b24a842477c">
                                        <tbody>
                                        <tr>
                                        <td class="outsidegutter" align="left" style="direction:ltr;text-align:left;padding: 0 14px 0 14px;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                                        <tbody>
                                        
                                        <!-- Top half -->
                                        <tr>
                                        <td style="direction:ltr;text-align:left;padding-top: 30px; padding-bottom: 30px;">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                        <td>
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" class="t10of12" align="center" style="Margin: 0 auto; border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                        <tbody><tr>
                                        <td style="direction:ltr;text-align:left;padding-left: 0; padding-right: 0;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; direction: rtl; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                        <tbody><tr>
                                        <td class="ignoreTd" style="font-size:0; text-align: left ">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table width="560" align="left" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                        <td width="224">
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" class="t5of12" style="border: none; border-collapse: collapse; border-spacing: 0; direction: ltr; display: inline-block; max-width: 224px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: top; width: 100%;">
                                        <tbody><tr>
                                        <td style="direction:ltr;text-align:left;padding-left: 12px; padding-right: 12px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                        <tbody><tr>
                                        <td style="direction:ltr;text-align:left;">
                                        
                                        
                                        
                                        
                                        
                                        </td>
                                        </tr>
                                        </tbody></table>
                                        </td>
                                        </tr>
                                        </tbody></table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        
                                        
                                        </td>
                                        </tr>
                                        </tbody></table>
                                        </td>
                                        </tr>
                                        </tbody></table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                        
                                        </td>
                                        </tr>
                                        <!-- END top half -->
                                        
                                        
                                        
                                        
                                        
                                        
                                        
                                        <!-- bottom half -->
                                        <tr>
                                        <td style="direction:ltr;text-align:left; padding-bottom: 30px;">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                        <td width="560">
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" class="t10of12" align="center" style="Margin: 0 auto; border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                        <tbody><tr>
                                        <td style="direction:ltr;text-align:left;padding-left: 0; padding-right: 0;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; direction: rtl; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                        <tbody><tr>
                                        <td class="ignoreTd" style="font-size:0; text-align: left">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table width="560" align="left" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                        <td width="224">
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" class="t4of12" style="border: none; border-collapse: collapse; border-spacing: 0; direction: ltr; display: inline-block; max-width: 224px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: top; width: 100%;">
                                        <tbody><tr>
                                        <td style="direction:ltr;text-align:left;padding-left: 12px; padding-right: 12px;">
                                        <table border="0" cellpadding="0" cellspacing="0" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; ">
                                        <tbody><tr>
                                        <td class="p3 white" style="padding-bottom: 12px; direction:ltr;text-align:left;">
                                        
                                        <!-- social table -->
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 130px;">
                                        <tbody>
                                        <tr>
                                        <td width="43" align="center" style="direction: ltr; text-align: left;">
                                        <a href="https://www.linkedIn.com/company/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/facebook-icon.svg" width="13" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 13px; outline: none; text-decoration: none; width: 100%;">
                                        </a>
                                        </td>
                                        <td width="43" align="center" style="direction: ltr; text-align: left;">
                                        <a href="https://mobile.twitter.com/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/twitter-icon.svg" width="19" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 19px; outline: none; text-decoration: none; width: 100%;">
                                        </a>
                                        </td>
                                        <td width="43" align="center" style="direction: ltr; text-align: left;">
                                        <a href="https://www.linkedIn.com/company/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/linkedin-icon.svg" width="19" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 19px; outline: none; text-decoration: none; width: 100%;">
                                        </a>
                                        </td>
                                        <td width="43" align="center" style="direction: ltr; text-align: left;">
                                        <a href="https://www.instagram.com/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/instagram-icon.svg" width="16" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 16px; outline: none; text-decoration: none; width: 100%;">
                                        </a>
                                        </td>
                                        </tr>
                                        </tbody></table>
                                        <!-- END social table -->
                                        
                                        </td>
                                        </tr>
                                        </tbody></table>
                                        </td>
                                        </tr>
                                        </tbody></table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        <td width="336">
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" class="t6of12" style="border: none; border-collapse: collapse; border-spacing: 0; direction: ltr; display: inline-block; max-width: 336px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: top; width: 100%;">
                                        <tbody><tr>
                                        <td style="direction:ltr;text-align:left;padding-left: 12px; padding-right: 12px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                        <tbody><tr>
                                        <td class="p2" style="direction:ltr;text-align:left;color: #e5e5e5; font-family: 'UberMoveText-Regular', 'HelveticaNeue', Helvetica, Arial, sans-serif; font-size: 10px; line-height: 18px;">
                                            <a className="link" target="_blank" href="tel:+2349074554735" style="text-decoration: none; color: #e5e5e5">
                                            +234-(0)907-455-4735,
                                            </a>
                                            <br />
                                            <a className="link" target="_blank" href="mailto:hello@firstclassbrain.com" style="text-decoration: none; color: #e5e5e5">
                                            hello@firstclassbrain.com
                                            </a>
                                            <br>
                                            <a className="link" target="_blank" href="https://goo.gl/maps/mMbMwrJQVxoRrb1R8" rel="noopener noreferrer" target="_blank" style="text-decoration: none; color: #e5e5e5">
                                            No. 27, Olayiwola Street, New Oko-oba, Lagos State
                                            </a>
                                            <br>
                                            <a target="_blank" href="https://firstclassbrain.com/" style="text-decoration: none; color: #e5e5e5">Firstclassbrain.com</a>
                                        
                                        </td>
                                        </tr>
                                        </tbody></table>
                                        </td>
                                        </tr>
                                        </tbody></table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                        </td>
                                        </tr>
                                        </tbody></table>
                                        </td>
                                        </tr>
                                        </tbody></table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                        </td>
                                        </tr>
                                        <!-- END bottom half -->
                                        
                                        
                                        
                                        </tbody></table>
                                        </td>
                                        </tr>
                                        
                                        
                                        </tbody></table>
                                        <!-- close footer update - ces -->
                                        </td>
                                        </tr>
                                        </tbody>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                        </td>
                                        </tr>
                                        </tbody>
                                        </table>
                                        
                                        
                                        
                                        
                                        </body>
                                </html>
                                `
                            
                            }
            
                            passwordTransporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.log(error)
                                    return res.status(422).json({error})
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
                            paid,
                            isVerified,
                            pic,
                            emailToken
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
                            paid,
                            isVerified,
                            pic,
                            emailToken
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

// end of list of students


router.post('/signup-instructor', (req, res) => {
    const {
        firstName,
        lastName,
        phone,
        email,
        pic,
        originalPassword,
        password
    } = req.body
    if(!firstName || !lastName || !phone || !email || !password || !originalPassword){
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
                        originalPassword,
                        password: hashedPassword
                    })
                    instructor.save()
                        .then(instructor => {

                            let mailOptions =  {
                                to:instructor.email,
                                from:'"Firstclassbrain" <password@firstclassbrain.com>',
                                subject:"Welcome to FirstclassBrain",
                                html: `
                                <!DOCTYPE html>
                                    <html lang="en"
                                    xmlns="http://www.w3.org/1999/xhtml" 
                                    xmlns:v="urn:schemas-microsoft-com:vml" 
                                    xmlns:o="urn:schemas-microsoft-com:office:office"
                                    >
                                    <head>
                                            <meta charset="UTF-8">
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                            <title>Document</title>

                                            <!-- <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> -->
                                            <!--[if !mso]><!-- -->
                                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                            <!--<![endif]-->
                                            <!--[if gte mso 9]><xml>
                                            <o:OfficeDocumentSettings>
                                            <o:AllowPNG/>
                                            <o:PixelsPerInch>96</o:PixelsPerInch>
                                            </o:OfficeDocumentSettings>
                                            </xml><![endif]-->


                                            <style>
                                                h1,.h1{
                                                font-size: 60px !important;
                                                line-height: 66px !important;
                                                }
                                                h2,.h2{
                                                font-size: 44px !important;
                                                line-height: 50px !important;
                                                }
                                                .btn a:hover{
                                                background-color:#000000!important;
                                                border-color:#000000!important;
                                                }
                                                .textcta a:hover{
                                                color:#000000!important;
                                                }
                                                p {margin: 0 !important;}
                                                .divbox:hover, * [lang~="x-divbox"]:hover {
                                                background-color: #000000 !important;
                                                }
                                                .boxfont:hover, * [lang~="x-boxfont"]:hover {
                                                color: #ffffff !important;
                                                }

                                                .mobileContent{display: none;}

                                                @media (max-width: 414px) {
                                                .mobileContent{display: block !important}
                                                .desktopContent{display: none !important}
                                                .mob2_m_pad{padding-bottom: 15px !important}

                                                .hide {display: none !important;}
                                                .show {display: inline-block !important; width:auto !important; height:auto !important; overflow:visible !important; float:none !important; visibility:visible !important; border:none !important; padding-bottom:0px !important; vertical-align: bottom !important;}
                                                .show1 {
                                                        display: block !important;
                                                        max-height: none !important;
                                                }
                                                h1, h2, .h1, .h2{
                                                        font-size: 34px !important;
                                                        line-height: 40px !important;
                                                }
                                                .mobfb414, .mobfb414 td{
                                                        padding-left:0 !important;
                                                        padding-right:0 !important;
                                                        max-width:414px !important;
                                                }
                                                .mobmw414{
                                                        max-width:414px !important;
                                                }
                                                }
                                            </style>

                                            <style type="text/css"> 
                                            @media screen and (max-width:699px){.full,.t10of12,.t11of12,.t12of12,.t1of12,.t2of12,.t3of12,.t4of12,.t5of12,.t6of12,.t7of12,.t8of12,.t9of12{width:100%!important;max-width:none!important}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}.headerTextLeft{text-align:left!important}.hide{display:none!important}.mp0{padding:0!important}}@font-face{font-family:UberMove-Medium;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMove-Medium.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMove-Medium.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Light;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Light.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Light.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Regular;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Regular.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Regular.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Medium;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Medium.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Medium.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Bold;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Bold.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Bold.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}
                                            </style>
                                    </head>
                                    <body dir="ltr" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#d6d6d5;margin:0;min-width:100%;padding:0;width:100%">
                                            <span data-blockuuid="ab2f7a3a-54b3-4956-8fcc-02b837adf583" style="display: none; max-height: 0px; font-size: 0px; overflow: hidden; mso-hide: all;">
                                            Get familiar with useful features like Spotlight and Share My Trip.
                                            </span>
                                            
                                            <style>.yahooHide{display:none!important}</style>
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#d6d6d5;border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0" bgcolor="#d6d6d5" class="">
                                            <tbody>
                                            <tr>
                                            <td align="center" style="display: block;">
                                            <!--[if (gte mso 9)|(IE)]>
                                            <table width="700" align="center" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                            <td>
                                            <![endif]-->
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;border-spacing:0;max-width:700px;mso-table-lspace:0;mso-table-rspace:0" class="">
                                            <tbody>
                                            <tr>
                                            <td style="background-color:#ffffff">
                                            
                                            <!-- mod1  mt_2019/10/23  -->
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" data-blockuuid="bb61e9fc-ef96-4b2d-8311-5e8804baa199">
                                                <tbody><tr>
                                                <td class="" align="left" style="direction:ltr;text-align:left;">
                                            <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                                                        <tbody><tr>
                                                        <td class="mob_bg" valign="top" background="https://s3-us-west-2.amazonaws.com/uber-common-public/svc-ugdb/82bac177-a494-410c-a1e7-35abca6689e2_HDGIF2_700x260.gif" bgcolor="#000000" style="background-image:url('https://s3-us-west-2.amazonaws.com/uber-common-public/svc-ugdb/82bac177-a494-410c-a1e7-35abca6689e2_HDGIF2_700x260.gif');background-color: #000000; background-size: contain; background-position: bottom right; background-repeat: no-repeat;" align="center" height="180">
                                                <!--[if gte mso 9]>
                                                            <v:image xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block; width: 700px; height: 240px;" src="https://s3-us-west-2.amazonaws.com/uber-common-public/svc-ugdb/82bac177-a494-410c-a1e7-35abca6689e2_HDGIF2_700x260.gif" />
                                                            <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block;position: absolute; width: 700px; height: 260px;">
                                                            <v:fill  opacity="0%" color="#000000"  />
                                                            <v:textbox inset="0,0,0,0">
                                                            <![endif]-->
                                                            <div>
                                            
                                            
                                            
                                            <!-- content  mt_2019/10/23  -->
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                                <tbody><tr>
                                            
                                                <td width="14">&nbsp;</td>
                                            
                                                <td class="outsidegutter" align="left" style="direction:ltr;text-align:left;">
                                                    <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                                                        <tbody><tr>
                                                        <td align="center">
                                            
                                            <!--[if (gte mso 9)|(IE)]>
                                            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                <td>
                                                    <![endif]-->
                                                    <table border="0" cellpadding="0" cellspacing="0" class="t10of12" align="center" style="border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                                        <tbody><tr>
                                                            <td width="12">&nbsp;</td>
                                                            <td style="direction:ltr;text-align:left;">
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                                <tbody><tr>
                                                                    <td style="direction:ltr;text-align:left;">
                                            
                                            
                                                                    </td>
                                                                </tr>
                                            
                                                                <tr>
                                                                <td valign="top" style="direction:ltr;text-align:left;">
                                            
                                                                </td>
                                                                </tr>
                                            
                                                            </tbody></table>
                                                            </td>
                                                            <td width="12">&nbsp;</td>
                                                        </tr>
                                                    </tbody></table>
                                                    <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                </tr>
                                            </table>
                                            <![endif]-->
                                                        </td>
                                            
                                            
                                                        </tr>
                                                    </tbody></table>
                                                </td>
                                            
                                                <td width="14">&nbsp;</td>
                                                </tr>
                                            </tbody></table>
                                            <!-- close content -->
                                            
                                            
                                            
                                            
                                            
                                                            </div>
                                                            <!--[if gte mso 9]>
                                                            </v:textbox>
                                                            </v:fill>
                                                            </v:rect>
                                                            </v:image>
                                                            <![endif]-->
                                                        </td>
                                                        </tr>
                                                    </tbody></table>
                                                </td>
                                                </tr>
                                            </tbody></table>
                                            <!-- close mod1 -->
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;border-spacing:0;margin:auto;max-width:700px;mso-table-lspace:0;mso-table-rspace:0" class="tron">
                                            <tbody>
                                            <tr>
                                            <td align="center">
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#fff;border:0;border-collapse:collapse;border-spacing:0;margin:auto;mso-table-lspace:0;mso-table-rspace:0" bgcolor="#ffffff" class="basetable">
                                            <tbody>
                                            <tr>
                                            <td align="center">
                                            <!--[if (gte mso 9)|(IE)]>
                                            <table width="700" align="center" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                            <td align="center">
                                            <![endif]-->
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="basetable" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0">
                                            <tbody>
                                            <tr>
                                            <td align="center" style="background-color:#ffffff">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="basetable" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0">
                                            <tbody>
                                            <tr>
                                            <td>
                                            <!--[if (gte mso 9)|(IE)]>
                                            <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                            <td>
                                            <![endif]-->
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="basetable" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0">
                                            <tbody>
                                            <tr>
                                            <td>
                                            <!--[if (gte mso 9)|(IE)]>
                                            <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                            <td>
                                            <![endif]-->
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0" class="">
                                            <tbody>
                                            <tr>
                                            <td>
                                            <!-- mod2 mt_2019/10/23  -->
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" data-blockuuid="fee9d07e-d14a-498f-9709-d1970a2a6c42">
                                                <tbody><tr>
                                                <td class="outsidegutter" align="left" style="direction:ltr;text-align:left;padding: 0 14px 0 14px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                                                        <tbody><tr>
                                                            <td style="direction:ltr;text-align:left;">
                                            
                                            
                                            
                                            <!--[if (gte mso 9)|(IE)]>
                                            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                <td>
                                                    <![endif]-->
                                                    <table border="0" cellpadding="0" cellspacing="0" class="t10of12 layout" align="center" style="border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                                        <tbody><tr>
                                                            <td class="mob2_m_pad" style="direction:ltr;text-align:left;font-size: 1px; height: 1px; line-height: 1px; padding-bottom: 30px; padding-left: 0px !important; padding-right: 0px !important; padding-top: 30px;">
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                                <tbody><tr>
                                                                    <td style="direction:ltr;text-align:left;font-size: 0;" valign="middle">
                                            
                                            
                                            <!--[if (gte mso 9)|(IE)]>
                                            <table width="336" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;vertical-align:middle;">
                                                <tr>
                                                <td>
                                                    <![endif]-->
                                                    <table border="0" cellpadding="0" cellspacing="0" class="t6of12" style="border: none; border-collapse: collapse; border-spacing: 0; display: inline-block; max-width: 336px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: middle; width: 100%;">
                                                        <tbody><tr>
                                                            <td style="direction:ltr;text-align:left;padding-bottom: 10px; padding-left: 12px; padding-right: 12px; padding-top: 10px;">
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                                <tbody><tr>
                                                                    <td class="h5" style="direction:ltr;text-align:left;color: #000000; font-family: 'UberMove-Medium', 'HelveticaNeue', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 30px; padding-bottom: 3px; padding-top: 7px;">Congratulations!</td>
                                                                </tr>
                                                                <tr>
                                                                <td style="direction:ltr;text-align:left;">
                                            
                                            
                                            
                                            <!--[if (gte mso 9)|(IE)]>
                                            <table width="280" align="left" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                <td>
                                                    <![endif]-->
                                                    <table border="0" cellpadding="0" cellspacing="0" class="t5of12 layout" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; max-width: 280px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                                        <tbody><tr>
                                                            <td style="direction:ltr;text-align:left;font-size: 1px; height: 1px; line-height: 1px; padding-left: 0px !important; padding-right: 0px !important;">
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                                <tbody><tr>
                                                                    <td class="p2" style="direction:ltr;text-align:left;color: #000000; font-family: 'UberMoveText-Regular', 'HelveticaNeue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 22px; padding-bottom: 12px; padding-top: 7px;"><p>Hello ${instructor.firstName}. You have just been selected as an instructor on FirstclassBrain.<br /><br />
                                                                    Your password current password is <b style="color:teal;">${instructor.originalPassword}</b>
                                                                    <br /><br />
                                                                    Proceed to your Instructor dashboard by clicking on the button below.</p>
                                            </td>
                                                                </tr>
                                                            </tbody></table>
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                                    <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                </tr>
                                            </table>
                                            <![endif]-->
                                                                </td>
                                                                </tr>
                                                                <tr>
                                                                <td style="direction:ltr;text-align:left;">
                                            <table border="0" cellpadding="0" cellspacing="0" class="basetable" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                            <tbody><tr>
                                                <td class="cta textcta" lang="x-textcta" style="direction:ltr;text-align:left;font-family: 'UberMoveText-Bold', 'HelveticaNeueMedium', 'HelveticaNeue-Medium', 'Helvetica Neue Medium', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 22px;"><a href="https://instructors.firstclassbrain.com" style="text-decoration:none; color:#000000;">Proceed to Dashboard <span style="padding-left:2px;font-size:14px;" class="arrow">❯</span></a></td>
                                            </tr>
                                            </tbody></table>
                                                                </td>
                                                                </tr>
                                                            </tbody></table>
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                                    <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                </tr>
                                            </table>
                                            <![endif]-->
                                            
                                            
                                            
                                            <!--[if mso]></td>
                                            <td valign="top">
                                                <![endif]-->
                                            
                                            
                                            
                                            <!--[if (gte mso 9)|(IE)]>
                                            <table width="224" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;vertical-align:middle;">
                                                <tr>
                                                <td>
                                                    <![endif]-->
                                                    <table border="0" cellpadding="0" cellspacing="0" class="t4of12" style="border: none; border-collapse: collapse; border-spacing: 0; display: inline-block; max-width: 224px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: middle; width: 100%;">
                                                        <tbody><tr>
                                                            <td class="desktopContent" style="direction:ltr;text-align:left;padding-bottom: 15px; padding-left: 12px; padding-right: 12px; padding-top: 15px;">
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                                <tbody><tr>
                                                                    <td style="direction:ltr;text-align:left;">
                                                                    <div class="desktopContent">
                                                                        <img src="https://extras.firstclassbrain.com/dashboard.jpg" width="200" height="" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-width: 200px; outline: none; text-decoration: none; width: 100%; border:20px teal solid;" border="0" alt="">
                                                                    </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody></table>
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                                    <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                </tr>
                                            </table>
                                            <![endif]-->
                                            
                                            
                                            
                                            
                                            
                                            
                                                                    </td>
                                                                </tr>
                                                            </tbody></table>
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                                    <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                </tr>
                                            </table>
                                            <![endif]-->
                                            
                                            
                                            
                                            
                                                            </td>
                                                        </tr>
                                                    </tbody></table>
                                                </td>
                                                </tr>
                                            </tbody></table>
                                            
                                            <div class="mobileContent" style="display: none; mso-hide: all;">
                                            <img src="https://extras.firstclassbrain.com/dashboard.jpg" height="" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-width: 100%; outline: none; text-decoration: none; width: 100%; border-top:20px teal solid; border-bottom:20px teal solid; margin-bottom:20px;" border="0" alt="">
                                            </div>
                                            
                                            
                                            <!-- close mod2 mt_2019/10/23  -->
                                            </td>
                                            </tr>
                                            </tbody>
                                            </table>
                                            <!--[if (gte mso 9)|(IE)]>
                                            </td>
                                            </tr>
                                            </table>
                                            <![endif]-->
                                            </td>
                                            </tr>
                                            </tbody>
                                            </table>
                                            <!--[if (gte mso 9)|(IE)]>
                                            </td>
                                            </tr>
                                            </table>
                                            <![endif]-->
                                            </td>
                                            </tr>
                                            </tbody>
                                            </table>
                                            </td>
                                            </tr>
                                            </tbody>
                                            </table>
                                            <!--[if (gte mso 9)|(IE)]>
                                            </td>
                                            </tr>
                                            </table>
                                            <![endif]-->
                                            </td>
                                            </tr>
                                            </tbody>
                                            </table>
                                            <!-- END LIST-->
                                            </td>
                                            </tr>
                                            <!-- END BODY-->
                                            </tbody>
                                            </table>
                                            <!-- footer update july 31 2019  cf    -->
                                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #000000; border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" data-blockuuid="be0d7749-5ff0-40a5-834d-5b24a842477c">
                                            <tbody>
                                            <tr>
                                            <td class="outsidegutter" align="left" style="direction:ltr;text-align:left;padding: 0 14px 0 14px;">
                                            <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                                            <tbody>
                                            
                                            <!-- Top half -->
                                            <tr>
                                            <td style="direction:ltr;text-align:left;padding-top: 30px; padding-bottom: 30px;">
                                            <!--[if (gte mso 9)|(IE)]>
                                            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                            <td>
                                            <![endif]-->
                                            <table border="0" cellpadding="0" cellspacing="0" class="t10of12" align="center" style="Margin: 0 auto; border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                            <tbody><tr>
                                            <td style="direction:ltr;text-align:left;padding-left: 0; padding-right: 0;">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; direction: rtl; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                            <tbody><tr>
                                            <td class="ignoreTd" style="font-size:0; text-align: left ">
                                            <!--[if (gte mso 9)|(IE)]>
                                            <table width="560" align="left" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                            <td width="224">
                                            <![endif]-->
                                            <table border="0" cellpadding="0" cellspacing="0" class="t5of12" style="border: none; border-collapse: collapse; border-spacing: 0; direction: ltr; display: inline-block; max-width: 224px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: top; width: 100%;">
                                            <tbody><tr>
                                            <td style="direction:ltr;text-align:left;padding-left: 12px; padding-right: 12px;">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                            <tbody><tr>
                                            <td style="direction:ltr;text-align:left;">
                                            
                                            
                                            
                                            
                                            
                                            </td>
                                            </tr>
                                            </tbody></table>
                                            </td>
                                            </tr>
                                            </tbody></table>
                                            <!--[if (gte mso 9)|(IE)]>
                                            </td>
                                            
                                            
                                            </td>
                                            </tr>
                                            </tbody></table>
                                            </td>
                                            </tr>
                                            </tbody></table>
                                            <!--[if (gte mso 9)|(IE)]>
                                            </td>
                                            </tr>
                                            </table>
                                            <![endif]-->
                                            
                                            </td>
                                            </tr>
                                            <!-- END top half -->
                                            
                                            
                                            
                                            
                                            
                                            
                                            
                                            <!-- bottom half -->
                                            <tr>
                                            <td style="direction:ltr;text-align:left; padding-bottom: 30px;">
                                            <!--[if (gte mso 9)|(IE)]>
                                            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                            <td width="560">
                                            <![endif]-->
                                            <table border="0" cellpadding="0" cellspacing="0" class="t10of12" align="center" style="Margin: 0 auto; border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                            <tbody><tr>
                                            <td style="direction:ltr;text-align:left;padding-left: 0; padding-right: 0;">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; direction: rtl; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                            <tbody><tr>
                                            <td class="ignoreTd" style="font-size:0; text-align: left">
                                            <!--[if (gte mso 9)|(IE)]>
                                            <table width="560" align="left" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                            <td width="224">
                                            <![endif]-->
                                            <table border="0" cellpadding="0" cellspacing="0" class="t4of12" style="border: none; border-collapse: collapse; border-spacing: 0; direction: ltr; display: inline-block; max-width: 224px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: top; width: 100%;">
                                            <tbody><tr>
                                            <td style="direction:ltr;text-align:left;padding-left: 12px; padding-right: 12px;">
                                            <table border="0" cellpadding="0" cellspacing="0" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; ">
                                            <tbody><tr>
                                            <td class="p3 white" style="padding-bottom: 12px; direction:ltr;text-align:left;">
                                            
                                            <!-- social table -->
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 130px;">
                                            <tbody>
                                            <tr>
                                            <td width="43" align="center" style="direction: ltr; text-align: left;">
                                            <a href="https://www.linkedIn.com/company/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/facebook-icon.svg" width="13" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 13px; outline: none; text-decoration: none; width: 100%;">
                                            </a>
                                            </td>
                                            <td width="43" align="center" style="direction: ltr; text-align: left;">
                                            <a href="https://mobile.twitter.com/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/twitter-icon.svg" width="19" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 19px; outline: none; text-decoration: none; width: 100%;">
                                            </a>
                                            </td>
                                            <td width="43" align="center" style="direction: ltr; text-align: left;">
                                            <a href="https://www.linkedIn.com/company/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/linkedin-icon.svg" width="19" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 19px; outline: none; text-decoration: none; width: 100%;">
                                            </a>
                                            </td>
                                            <td width="43" align="center" style="direction: ltr; text-align: left;">
                                            <a href="https://www.instagram.com/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/instagram-icon.svg" width="16" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 16px; outline: none; text-decoration: none; width: 100%;">
                                            </a>
                                            </td>
                                            </tr>
                                            </tbody></table>
                                            <!-- END social table -->
                                            
                                            </td>
                                            </tr>
                                            </tbody></table>
                                            </td>
                                            </tr>
                                            </tbody></table>
                                            <!--[if (gte mso 9)|(IE)]>
                                            </td>
                                            <td width="336">
                                            <![endif]-->
                                            <table border="0" cellpadding="0" cellspacing="0" class="t6of12" style="border: none; border-collapse: collapse; border-spacing: 0; direction: ltr; display: inline-block; max-width: 336px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: top; width: 100%;">
                                            <tbody><tr>
                                            <td style="direction:ltr;text-align:left;padding-left: 12px; padding-right: 12px;">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                            <tbody><tr>
                                            <td class="p2" style="direction:ltr;text-align:left;color: #e5e5e5; font-family: 'UberMoveText-Regular', 'HelveticaNeue', Helvetica, Arial, sans-serif; font-size: 10px; line-height: 18px;">
                                                <a className="link" target="_blank" href="tel:+2349074554735" style="text-decoration: none; color: #e5e5e5">
                                                +234-(0)907-455-4735,
                                                </a>
                                                <br />
                                                <a className="link" target="_blank" href="mailto:hello@firstclassbrain.com" style="text-decoration: none; color: #e5e5e5">
                                                hello@firstclassbrain.com
                                                </a>
                                                <br>
                                                <a className="link" target="_blank" href="https://goo.gl/maps/mMbMwrJQVxoRrb1R8" rel="noopener noreferrer" target="_blank" style="text-decoration: none; color: #e5e5e5">
                                                No. 27, Olayiwola Street, New Oko-oba, Lagos State
                                                </a>
                                                <br>
                                                <a target="_blank" href="https://firstclassbrain.com/" style="text-decoration: none; color: #e5e5e5">Firstclassbrain.com</a>
                                            
                                            </td>
                                            </tr>
                                            </tbody></table>
                                            </td>
                                            </tr>
                                            </tbody></table>
                                            <!--[if (gte mso 9)|(IE)]>
                                            </td>
                                            </tr>
                                            </table>
                                            <![endif]-->
                                            </td>
                                            </tr>
                                            </tbody></table>
                                            </td>
                                            </tr>
                                            </tbody></table>
                                            <!--[if (gte mso 9)|(IE)]>
                                            </td>
                                            </tr>
                                            </table>
                                            <![endif]-->
                                            </td>
                                            </tr>
                                            <!-- END bottom half -->
                                            
                                            
                                            
                                            </tbody></table>
                                            </td>
                                            </tr>
                                            
                                            
                                            </tbody></table>
                                            <!-- close footer update - ces -->
                                            </td>
                                            </tr>
                                            </tbody>
                                            </table>
                                            <!--[if (gte mso 9)|(IE)]>
                                            </td>
                                            </tr>
                                            </table>
                                            <![endif]-->
                                            </td>
                                            </tr>
                                            </tbody>
                                            </table>
                                            
                                            
                                            
                                            
                                            </body>
                                    </html>
                                `
                            
                            }
            
                            passwordTransporter.sendMail(mailOptions, (error, info) => {
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

router.post('/verify-email/instructor', (req, res) => {
    const {token} = req.body

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
        lastName,
        email,
        password
    } = req.body
    if(!firstName || !lastName || !email || !password){
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
                        lastName,
                        email,
                        password: hashedPassword,
                        authenticated: "true"
                    })
                    admin.save()
                        .then(admin => {
                            res.json({admin})
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

router.post('/web/signin-admin', (req, res) => {
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
                        const {
                            _id, 
                            firstName,
                            lastName,
                            email,
                            authenticated
                        } = savedAdmin
                        return res.json({token, admin:{
                            _id, 
                            firstName,
                            lastName,
                            email,
                            authenticated
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
                    subject:"Reset Password",
                    html:   `                    
                    <!DOCTYPE html>
                    <html lang="en"
                        xmlns="http://www.w3.org/1999/xhtml" 
                        xmlns:v="urn:schemas-microsoft-com:vml" 
                        xmlns:o="urn:schemas-microsoft-com:office:office"
                    >
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Document</title>

                            <!-- <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> -->
                            <!--[if !mso]><!-- -->
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <!--<![endif]-->
                            <!--[if gte mso 9]><xml>
                            <o:OfficeDocumentSettings>
                            <o:AllowPNG/>
                            <o:PixelsPerInch>96</o:PixelsPerInch>
                            </o:OfficeDocumentSettings>
                            </xml><![endif]-->


                            <style>
                                h1,.h1{
                                    font-size: 60px !important;
                                    line-height: 66px !important;
                                }
                                h2,.h2{
                                    font-size: 44px !important;
                                    line-height: 50px !important;
                                }
                                .btn a:hover{
                                    background-color:#000000!important;
                                    border-color:#000000!important;
                                }
                                .textcta a:hover{
                                    color:#000000!important;
                                }
                                p {margin: 0 !important;}
                                .divbox:hover, * [lang~="x-divbox"]:hover {
                                    background-color: #000000 !important;
                                }
                                .boxfont:hover, * [lang~="x-boxfont"]:hover {
                                    color: #ffffff !important;
                                }

                                .mobileContent{display: none;}

                                @media (max-width: 414px) {
                                    .mobileContent{display: block !important}
                                    .desktopContent{display: none !important}
                                    .mob2_m_pad{padding-bottom: 15px !important}

                                    .hide {display: none !important;}
                                    .show {display: inline-block !important; width:auto !important; height:auto !important; overflow:visible !important; float:none !important; visibility:visible !important; border:none !important; padding-bottom:0px !important; vertical-align: bottom !important;}
                                    .show1 {
                                        display: block !important;
                                        max-height: none !important;
                                    }
                                    h1, h2, .h1, .h2{
                                        font-size: 34px !important;
                                        line-height: 40px !important;
                                    }
                                    .mobfb414, .mobfb414 td{
                                        padding-left:0 !important;
                                        padding-right:0 !important;
                                        max-width:414px !important;
                                    }
                                    .mobmw414{
                                        max-width:414px !important;
                                    }
                                }
                            </style>

                            <style type="text/css"> 
                                @media screen and (max-width:699px){.full,.t10of12,.t11of12,.t12of12,.t1of12,.t2of12,.t3of12,.t4of12,.t5of12,.t6of12,.t7of12,.t8of12,.t9of12{width:100%!important;max-width:none!important}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}.headerTextLeft{text-align:left!important}.hide{display:none!important}.mp0{padding:0!important}}@font-face{font-family:UberMove-Medium;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMove-Medium.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMove-Medium.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Light;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Light.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Light.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Regular;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Regular.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Regular.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Medium;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Medium.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Medium.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Bold;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Bold.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Bold.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}
                            </style>
                        </head>
                        <body dir="ltr" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#d6d6d5;margin:0;min-width:100%;padding:0;width:100%">
                            <span data-blockuuid="ab2f7a3a-54b3-4956-8fcc-02b837adf583" style="display: none; max-height: 0px; font-size: 0px; overflow: hidden; mso-hide: all;">
                                Get familiar with useful features like Spotlight and Share My Trip.
                            </span>
                            
                            <style>.yahooHide{display:none!important}</style>
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#d6d6d5;border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0" bgcolor="#d6d6d5" class="">
                            <tbody>
                            <tr>
                            <td align="center" style="display: block;">
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="700" align="center" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td>
                            <![endif]-->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;border-spacing:0;max-width:700px;mso-table-lspace:0;mso-table-rspace:0" class="">
                            <tbody>
                            <tr>
                            <td style="background-color:#000">
                            
                            
                            
                            <!-- mod1  mt_2019/10/23  -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" data-blockuuid="bb61e9fc-ef96-4b2d-8311-5e8804baa199">
                                <tbody><tr>
                                    <td class="" align="left" style="direction:ltr;text-align:left;">
                            <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                                        <tbody><tr>
                                            <td class="mob_bg" valign="top" background="https://s3-us-west-2.amazonaws.com/uber-common-public/svc-ugdb/82bac177-a494-410c-a1e7-35abca6689e2_HDGIF2_700x260.gif" bgcolor="#000000" style="background-image:url('https://s3-us-west-2.amazonaws.com/uber-common-public/svc-ugdb/82bac177-a494-410c-a1e7-35abca6689e2_HDGIF2_700x260.gif');background-color: #000000; background-size: contain; background-position: bottom right; background-repeat: no-repeat;" align="center" height="180">
                                    <!--[if gte mso 9]>
                                            <v:image xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block; width: 700px; height: 240px;" src="https://s3-us-west-2.amazonaws.com/uber-common-public/svc-ugdb/82bac177-a494-410c-a1e7-35abca6689e2_HDGIF2_700x260.gif" />
                                            <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block;position: absolute; width: 700px; height: 260px;">
                                                <v:fill  opacity="0%" color="#000000"  />
                                                <v:textbox inset="0,0,0,0">
                                                <![endif]-->
                                            <div>
                            
                            
                            
                            <!-- content  mt_2019/10/23  -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                <tbody><tr>
                            
                                <td width="14">&nbsp;</td>
                            
                                <td class="outsidegutter" align="left" style="direction:ltr;text-align:left;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                                        <tbody><tr>
                                            <td align="center">
                            
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td>
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" class="t10of12" align="center" style="border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                        <tbody><tr>
                                            <td width="12">&nbsp;</td>
                                            <td style="direction:ltr;text-align:left;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                    <tbody><tr>
                                                    <td style="direction:ltr;text-align:left;">
                            
                        
                            
                                                    </td>
                                                    </tr>
                            
                                                    <tr>
                                                    <td valign="top" style="direction:ltr;text-align:left;">
                            
                            
                            <!-- content  mt_2019/10/23  -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                <tbody><tr>
                                    <td class="h5 mp1 white" align="left" width="65%" valign="top" style="direction:ltr;text-align:left;color: #ffffff; font-family: 'UberMove-Medium', 'HelveticaNeue', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 30px; padding-bottom: 25px; padding-top: 7px;">&nbsp;</td>
                                    <td style="direction:ltr;text-align:left;">
                                    <img src="https://uber-static.s3.amazonaws.com/emails/2017/01/spacer_188x157.png" width="188" height="" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-width: 188px; outline: none; text-decoration: none; width: 100%;" border="0" alt="">
                                    </td>
                                </tr>
                            </tbody></table>
                            <!-- close content -->
                            
                                                    </td>
                                                    </tr>
                            
                                                </tbody></table>
                                            </td>
                                            <td width="12">&nbsp;</td>
                                        </tr>
                                        </tbody></table>
                                        <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                </tr>
                            </table>
                            <![endif]-->
                                            </td>
                            
                            
                                        </tr>
                                        </tbody></table>
                                    </td>
                            
                                    <td width="14">&nbsp;</td>
                                </tr>
                            </tbody></table>
                            <!-- close content -->
                            
                            
                            
                            
                            
                                            </div>
                                                <!--[if gte mso 9]>
                                                </v:textbox>
                                                </v:fill>
                                            </v:rect>
                                            </v:image>
                                            <![endif]-->
                                            </td>
                                        </tr>
                                        </tbody></table>
                                    </td>
                                </tr>
                            </tbody></table>
                            <!-- close mod1 -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;border-spacing:0;margin:auto;max-width:700px;mso-table-lspace:0;mso-table-rspace:0" class="tron">
                            <tbody>
                            <tr>
                            <td align="center">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#fff;border:0;border-collapse:collapse;border-spacing:0;margin:auto;mso-table-lspace:0;mso-table-rspace:0" bgcolor="#ffffff" class="basetable">
                            <tbody>
                            <tr>
                            <td align="center">
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="700" align="center" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td align="center">
                            <![endif]-->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="basetable" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0">
                            <tbody>
                            <tr>
                            <td align="center" style="background-color:#ffffff">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="basetable" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0">
                            <tbody>
                            <tr>
                            <td>
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td>
                            <![endif]-->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="basetable" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0">
                            <tbody>
                            <tr>
                            <td>
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td>
                            <![endif]-->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0" class="">
                            <tbody>
                            <tr>
                            <td>
                            <!-- mod2 mt_2019/10/23  -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" data-blockuuid="fee9d07e-d14a-498f-9709-d1970a2a6c42">
                                <tbody><tr>
                                    <td class="outsidegutter" align="left" style="direction:ltr;text-align:left;padding: 0 14px 0 14px;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                                        <tbody><tr>
                                            <td style="direction:ltr;text-align:left;">
                            
                            
                            
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td>
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" class="t10of12 layout" align="center" style="border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                        <tbody><tr>
                                            <td class="mob2_m_pad" style="direction:ltr;text-align:left;font-size: 1px; height: 1px; line-height: 1px; padding-bottom: 30px; padding-left: 0px !important; padding-right: 0px !important; padding-top: 30px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                    <tbody><tr>
                                                    <td style="direction:ltr;text-align:left;font-size: 0;" valign="middle">
                            
                            
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="336" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;vertical-align:middle;">
                                <tr>
                                    <td>
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" class="t6of12" style="border: none; border-collapse: collapse; border-spacing: 0; display: inline-block; max-width: 336px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: middle; width: 100%;">
                                        <tbody><tr>
                                            <td style="direction:ltr;text-align:left;padding-bottom: 10px; padding-left: 12px; padding-right: 12px; padding-top: 10px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                    <tbody><tr>
                                                    <td class="h5" style="direction:ltr;text-align:left;color: #000000; font-family: 'UberMove-Medium', 'HelveticaNeue', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 30px; padding-bottom: 3px; padding-top: 7px;">Hello There!</td>
                                                    </tr>
                                                    <tr>
                                                    <td style="direction:ltr;text-align:left;">
                            
                            
                            
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="280" align="left" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td>
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" class="t5of12 layout" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; max-width: 280px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                        <tbody><tr>
                                            <td style="direction:ltr;text-align:left;font-size: 1px; height: 1px; line-height: 1px; padding-left: 0px !important; padding-right: 0px !important;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                    <tbody><tr>
                                                    <td class="p2" style="direction:ltr;text-align:left;color: #000000; font-family: 'UberMoveText-Regular', 'HelveticaNeue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 22px; padding-bottom: 12px; padding-top: 7px;"><p>You are receiving this because you, <b style="color:#f00">or someone else</b>, have requested to reset your admin password on Firstclassbrain. Click on the link below to reset your password. If it doesn't redirect you to the Reset Password page on Firstclassbrain, copy and paste the link into your browser<br /><br />
                                                    <a href="http://admin.firstclassbrain.com/reset-password/${token}" style="color:teal;">http://admin.firstclassbrain.com/reset-password/${token}</a>
                                                    <br /><br />
                                                    Ignore this mail if this wasn't requested directly by you!</p>
                            </td>
                                                    </tr>
                                                </tbody></table>
                                            </td>
                                        </tr>
                                        </tbody></table>
                                        <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                </tr>
                            </table>
                            <![endif]-->
                                                    </td>
                                                    </tr>
                                                </tbody></table>
                                            </td>
                                        </tr>
                                        </tbody></table>
                                        <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                </tr>
                            </table>
                            <![endif]-->
                            
                            
                            
                            <!--[if mso]></td>
                            <td valign="top">
                                <![endif]-->
                            
                            
                            
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="224" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;vertical-align:middle;">
                                <tr>
                                    <td>
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" class="t4of12" style="border: none; border-collapse: collapse; border-spacing: 0; display: inline-block; max-width: 224px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: middle; width: 100%;">
                                        <tbody><tr>
                                            <td class="desktopContent" style="direction:ltr;text-align:left;padding-bottom: 15px; padding-left: 12px; padding-right: 12px; padding-top: 15px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                    <tbody><tr>
                                                    <td style="direction:ltr;text-align:left;">
                                                        <div class="desktopContent">
                                                        <img src="https://extras.firstclassbrain.com/password.jpg" width="200" height="" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-width: 200px; outline: none; text-decoration: none; width: 100%; border:20px teal solid;" border="0" alt="">
                                                        </div>
                                                    </td>
                                                    </tr>
                                                </tbody></table>
                                            </td>
                                        </tr>
                                        </tbody></table>
                                        <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                </tr>
                            </table>
                            <![endif]-->
                            
                            
                            
                            
                            
                            
                                                    </td>
                                                    </tr>
                                                </tbody></table>
                                            </td>
                                        </tr>
                                        </tbody></table>
                                        <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                </tr>
                            </table>
                            <![endif]-->
                            
                            
                            
                            
                                            </td>
                                        </tr>
                                        </tbody></table>
                                    </td>
                                </tr>
                            </tbody></table>
                            
                            <div class="mobileContent" style="display: none; mso-hide: all;">
                            <img src="https://extras.firstclassbrain.com/dashboard.jpg" height="" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-width: 100%; outline: none; text-decoration: none; width: 100%; border-top:20px teal solid; border-bottom:20px teal solid; margin-bottom:20px;" border="0" alt="">
                            </div>
                            
                            
                            <!-- close mod2 mt_2019/10/23  -->
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!-- END LIST-->
                            </td>
                            </tr>
                            <!-- END BODY-->
                            </tbody>
                            </table>
                            <!-- footer update july 31 2019  cf    -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #000000; border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" data-blockuuid="be0d7749-5ff0-40a5-834d-5b24a842477c">
                            <tbody>
                            <tr>
                            <td class="outsidegutter" align="left" style="direction:ltr;text-align:left;padding: 0 14px 0 14px;">
                            <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                            <tbody>
                            
                            <!-- Top half -->
                            <tr>
                            <td style="direction:ltr;text-align:left;padding-top: 30px; padding-bottom: 30px;">
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td>
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="t10of12" align="center" style="Margin: 0 auto; border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                            <tbody><tr>
                            <td style="direction:ltr;text-align:left;padding-left: 0; padding-right: 0;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; direction: rtl; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                            <tbody><tr>
                            <td class="ignoreTd" style="font-size:0; text-align: left ">
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="560" align="left" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td width="224">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="t5of12" style="border: none; border-collapse: collapse; border-spacing: 0; direction: ltr; display: inline-block; max-width: 224px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: top; width: 100%;">
                            <tbody><tr>
                            <td style="direction:ltr;text-align:left;padding-left: 12px; padding-right: 12px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                            <tbody><tr>
                            <td style="direction:ltr;text-align:left;">
                            
                            
                            
                            
                            
                            </td>
                            </tr>
                            </tbody></table>
                            </td>
                            </tr>
                            </tbody></table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            
                            
                            </td>
                            </tr>
                            </tbody></table>
                            </td>
                            </tr>
                            </tbody></table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                            
                            </td>
                            </tr>
                            <!-- END top half -->
                            
                            
                            
                            
                            
                            
                            
                            <!-- bottom half -->
                            <tr>
                            <td style="direction:ltr;text-align:left; padding-bottom: 30px;">
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td width="560">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="t10of12" align="center" style="Margin: 0 auto; border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                            <tbody><tr>
                            <td style="direction:ltr;text-align:left;padding-left: 0; padding-right: 0;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; direction: rtl; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                            <tbody><tr>
                            <td class="ignoreTd" style="font-size:0; text-align: left">
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="560" align="left" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td width="224">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="t4of12" style="border: none; border-collapse: collapse; border-spacing: 0; direction: ltr; display: inline-block; max-width: 224px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: top; width: 100%;">
                            <tbody><tr>
                            <td style="direction:ltr;text-align:left;padding-left: 12px; padding-right: 12px;">
                            <table border="0" cellpadding="0" cellspacing="0" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; ">
                            <tbody><tr>
                            <td class="p3 white" style="padding-bottom: 12px; direction:ltr;text-align:left;">
                            
                            <!-- social table -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 130px;">
                            <tbody>
                            <tr>
                            <td width="43" align="center" style="direction: ltr; text-align: left;">
                            <a href="https://www.linkedIn.com/company/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/facebook-icon.svg" width="13" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 13px; outline: none; text-decoration: none; width: 100%;">
                            </a>
                            </td>
                            <td width="43" align="center" style="direction: ltr; text-align: left;">
                            <a href="https://mobile.twitter.com/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/twitter-icon.svg" width="19" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 19px; outline: none; text-decoration: none; width: 100%;">
                            </a>
                            </td>
                            <td width="43" align="center" style="direction: ltr; text-align: left;">
                            <a href="https://www.linkedIn.com/company/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/linkedin-icon.svg" width="19" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 19px; outline: none; text-decoration: none; width: 100%;">
                            </a>
                            </td>
                            <td width="43" align="center" style="direction: ltr; text-align: left;">
                            <a href="https://www.instagram.com/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/instagram-icon.svg" width="16" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 16px; outline: none; text-decoration: none; width: 100%;">
                            </a>
                            </td>
                            </tr>
                            </tbody></table>
                            <!-- END social table -->
                            
                            </td>
                            </tr>
                            </tbody></table>
                            </td>
                            </tr>
                            </tbody></table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            <td width="336">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="t6of12" style="border: none; border-collapse: collapse; border-spacing: 0; direction: ltr; display: inline-block; max-width: 336px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: top; width: 100%;">
                            <tbody><tr>
                            <td style="direction:ltr;text-align:left;padding-left: 12px; padding-right: 12px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                            <tbody><tr>
                            <td class="p2" style="direction:ltr;text-align:left;color: #e5e5e5; font-family: 'UberMoveText-Regular', 'HelveticaNeue', Helvetica, Arial, sans-serif; font-size: 10px; line-height: 18px;">
                                <a className="link" target="_blank" href="tel:+2349074554735" style="text-decoration: none; color: #e5e5e5">
                                    +234-(0)907-455-4735,
                                </a>
                                <br />
                                <a className="link" target="_blank" href="mailto:hello@firstclassbrain.com" style="text-decoration: none; color: #e5e5e5">
                                    hello@firstclassbrain.com
                                </a>
                                <br>
                                <a className="link" target="_blank" href="https://goo.gl/maps/mMbMwrJQVxoRrb1R8" rel="noopener noreferrer" target="_blank" style="text-decoration: none; color: #e5e5e5">
                                    No. 27, Olayiwola Street, New Oko-oba, Lagos State
                                </a>
                                <br>
                                <a target="_blank" href="https://firstclassbrain.com/" style="text-decoration: none; color: #e5e5e5">Firstclassbrain.com</a>
                            
                            </td>
                            </tr>
                            </tbody></table>
                            </td>
                            </tr>
                            </tbody></table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                            </td>
                            </tr>
                            </tbody></table>
                            </td>
                            </tr>
                            </tbody></table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                            </td>
                            </tr>
                            <!-- END bottom half -->
                            
                            
                            
                            </tbody></table>
                            </td>
                            </tr>
                            
                            
                            </tbody></table>
                            <!-- close footer update - ces -->
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            
                            
                                
                                
                            </body>
                    </html>`
                }

                passwordTransporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error)
                        return res.status(422).json(error)
                    } else {
                        console.log('Email sent: ' + info.response)
                        res.json({message:"Check your email for a link to reset password!"})
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

                passwordTransporter.sendMail(mailOptions, (error, info) => {
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
                    html:   `                    
                    <!DOCTYPE html>
                    <html lang="en"
                        xmlns="http://www.w3.org/1999/xhtml" 
                        xmlns:v="urn:schemas-microsoft-com:vml" 
                        xmlns:o="urn:schemas-microsoft-com:office:office"
                    >
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Document</title>

                            <!-- <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> -->
                            <!--[if !mso]><!-- -->
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <!--<![endif]-->
                            <!--[if gte mso 9]><xml>
                            <o:OfficeDocumentSettings>
                            <o:AllowPNG/>
                            <o:PixelsPerInch>96</o:PixelsPerInch>
                            </o:OfficeDocumentSettings>
                            </xml><![endif]-->


                            <style>
                                h1,.h1{
                                    font-size: 60px !important;
                                    line-height: 66px !important;
                                }
                                h2,.h2{
                                    font-size: 44px !important;
                                    line-height: 50px !important;
                                }
                                .btn a:hover{
                                    background-color:#000000!important;
                                    border-color:#000000!important;
                                }
                                .textcta a:hover{
                                    color:#000000!important;
                                }
                                p {margin: 0 !important;}
                                .divbox:hover, * [lang~="x-divbox"]:hover {
                                    background-color: #000000 !important;
                                }
                                .boxfont:hover, * [lang~="x-boxfont"]:hover {
                                    color: #ffffff !important;
                                }

                                .mobileContent{display: none;}

                                @media (max-width: 414px) {
                                    .mobileContent{display: block !important}
                                    .desktopContent{display: none !important}
                                    .mob2_m_pad{padding-bottom: 15px !important}

                                    .hide {display: none !important;}
                                    .show {display: inline-block !important; width:auto !important; height:auto !important; overflow:visible !important; float:none !important; visibility:visible !important; border:none !important; padding-bottom:0px !important; vertical-align: bottom !important;}
                                    .show1 {
                                        display: block !important;
                                        max-height: none !important;
                                    }
                                    h1, h2, .h1, .h2{
                                        font-size: 34px !important;
                                        line-height: 40px !important;
                                    }
                                    .mobfb414, .mobfb414 td{
                                        padding-left:0 !important;
                                        padding-right:0 !important;
                                        max-width:414px !important;
                                    }
                                    .mobmw414{
                                        max-width:414px !important;
                                    }
                                }
                            </style>

                            <style type="text/css"> 
                                @media screen and (max-width:699px){.full,.t10of12,.t11of12,.t12of12,.t1of12,.t2of12,.t3of12,.t4of12,.t5of12,.t6of12,.t7of12,.t8of12,.t9of12{width:100%!important;max-width:none!important}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}.headerTextLeft{text-align:left!important}.hide{display:none!important}.mp0{padding:0!important}}@font-face{font-family:UberMove-Medium;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMove-Medium.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMove-Medium.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Light;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Light.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Light.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Regular;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Regular.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Regular.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Medium;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Medium.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Medium.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}@font-face{font-family:UberMoveText-Bold;src:url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Bold.woff) format('woff'),url(https://s3.amazonaws.com/uber-static/emails/2018/global/fonts/UberMove/UberMoveText-Bold.ttf) format('truetype');font-weight:400!important;font-style:normal!important;mso-font-alt:'Arial'}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}
                            </style>
                        </head>
                        <body dir="ltr" style="-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#d6d6d5;margin:0;min-width:100%;padding:0;width:100%">
                            <span data-blockuuid="ab2f7a3a-54b3-4956-8fcc-02b837adf583" style="display: none; max-height: 0px; font-size: 0px; overflow: hidden; mso-hide: all;">
                                Get familiar with useful features like Spotlight and Share My Trip.
                            </span>
                            
                            <style>.yahooHide{display:none!important}</style>
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#d6d6d5;border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0" bgcolor="#d6d6d5" class="">
                            <tbody>
                            <tr>
                            <td align="center" style="display: block;">
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="700" align="center" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td>
                            <![endif]-->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;border-spacing:0;max-width:700px;mso-table-lspace:0;mso-table-rspace:0" class="">
                            <tbody>
                            <tr>
                            <td style="background-color:#000">
                            
                            
                            
                            <!-- mod1  mt_2019/10/23  -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" data-blockuuid="bb61e9fc-ef96-4b2d-8311-5e8804baa199">
                                <tbody><tr>
                                    <td class="" align="left" style="direction:ltr;text-align:left;">
                            <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                                        <tbody><tr>
                                            <td class="mob_bg" valign="top" background="https://s3-us-west-2.amazonaws.com/uber-common-public/svc-ugdb/82bac177-a494-410c-a1e7-35abca6689e2_HDGIF2_700x260.gif" bgcolor="#000000" style="background-image:url('https://s3-us-west-2.amazonaws.com/uber-common-public/svc-ugdb/82bac177-a494-410c-a1e7-35abca6689e2_HDGIF2_700x260.gif');background-color: #000000; background-size: contain; background-position: bottom right; background-repeat: no-repeat;" align="center" height="180">
                                    <!--[if gte mso 9]>
                                            <v:image xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block; width: 700px; height: 240px;" src="https://s3-us-west-2.amazonaws.com/uber-common-public/svc-ugdb/82bac177-a494-410c-a1e7-35abca6689e2_HDGIF2_700x260.gif" />
                                            <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style=" border: 0;display: inline-block;position: absolute; width: 700px; height: 260px;">
                                                <v:fill  opacity="0%" color="#000000"  />
                                                <v:textbox inset="0,0,0,0">
                                                <![endif]-->
                                            <div>
                            
                            
                            
                            <!-- content  mt_2019/10/23  -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                <tbody><tr>
                            
                                <td width="14">&nbsp;</td>
                            
                                <td class="outsidegutter" align="left" style="direction:ltr;text-align:left;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                                        <tbody><tr>
                                            <td align="center">
                            
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td>
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" class="t10of12" align="center" style="border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                        <tbody><tr>
                                            <td width="12">&nbsp;</td>
                                            <td style="direction:ltr;text-align:left;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                    <tbody><tr>
                                                    <td style="direction:ltr;text-align:left;">
                            
                        
                            
                                                    </td>
                                                    </tr>
                            
                                                    <tr>
                                                    <td valign="top" style="direction:ltr;text-align:left;">
                            
                            
                            <!-- content  mt_2019/10/23  -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                <tbody><tr>
                                    <td class="h5 mp1 white" align="left" width="65%" valign="top" style="direction:ltr;text-align:left;color: #ffffff; font-family: 'UberMove-Medium', 'HelveticaNeue', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 30px; padding-bottom: 25px; padding-top: 7px;">&nbsp;</td>
                                    <td style="direction:ltr;text-align:left;">
                                    <img src="https://uber-static.s3.amazonaws.com/emails/2017/01/spacer_188x157.png" width="188" height="" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-width: 188px; outline: none; text-decoration: none; width: 100%;" border="0" alt="">
                                    </td>
                                </tr>
                            </tbody></table>
                            <!-- close content -->
                            
                                                    </td>
                                                    </tr>
                            
                                                </tbody></table>
                                            </td>
                                            <td width="12">&nbsp;</td>
                                        </tr>
                                        </tbody></table>
                                        <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                </tr>
                            </table>
                            <![endif]-->
                                            </td>
                            
                            
                                        </tr>
                                        </tbody></table>
                                    </td>
                            
                                    <td width="14">&nbsp;</td>
                                </tr>
                            </tbody></table>
                            <!-- close content -->
                            
                            
                            
                            
                            
                                            </div>
                                                <!--[if gte mso 9]>
                                                </v:textbox>
                                                </v:fill>
                                            </v:rect>
                                            </v:image>
                                            <![endif]-->
                                            </td>
                                        </tr>
                                        </tbody></table>
                                    </td>
                                </tr>
                            </tbody></table>
                            <!-- close mod1 -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;border-spacing:0;margin:auto;max-width:700px;mso-table-lspace:0;mso-table-rspace:0" class="tron">
                            <tbody>
                            <tr>
                            <td align="center">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#fff;border:0;border-collapse:collapse;border-spacing:0;margin:auto;mso-table-lspace:0;mso-table-rspace:0" bgcolor="#ffffff" class="basetable">
                            <tbody>
                            <tr>
                            <td align="center">
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="700" align="center" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td align="center">
                            <![endif]-->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="basetable" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0">
                            <tbody>
                            <tr>
                            <td align="center" style="background-color:#ffffff">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="basetable" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0">
                            <tbody>
                            <tr>
                            <td>
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td>
                            <![endif]-->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="basetable" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0">
                            <tbody>
                            <tr>
                            <td>
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td>
                            <![endif]-->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse;border-spacing:0;mso-table-lspace:0;mso-table-rspace:0" class="">
                            <tbody>
                            <tr>
                            <td>
                            <!-- mod2 mt_2019/10/23  -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" data-blockuuid="fee9d07e-d14a-498f-9709-d1970a2a6c42">
                                <tbody><tr>
                                    <td class="outsidegutter" align="left" style="direction:ltr;text-align:left;padding: 0 14px 0 14px;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                                        <tbody><tr>
                                            <td style="direction:ltr;text-align:left;">
                            
                            
                            
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td>
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" class="t10of12 layout" align="center" style="border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                        <tbody><tr>
                                            <td class="mob2_m_pad" style="direction:ltr;text-align:left;font-size: 1px; height: 1px; line-height: 1px; padding-bottom: 30px; padding-left: 0px !important; padding-right: 0px !important; padding-top: 30px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                    <tbody><tr>
                                                    <td style="direction:ltr;text-align:left;font-size: 0;" valign="middle">
                            
                            
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="336" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;vertical-align:middle;">
                                <tr>
                                    <td>
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" class="t6of12" style="border: none; border-collapse: collapse; border-spacing: 0; display: inline-block; max-width: 336px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: middle; width: 100%;">
                                        <tbody><tr>
                                            <td style="direction:ltr;text-align:left;padding-bottom: 10px; padding-left: 12px; padding-right: 12px; padding-top: 10px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                    <tbody><tr>
                                                    <td class="h5" style="direction:ltr;text-align:left;color: #000000; font-family: 'UberMove-Medium', 'HelveticaNeue', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 30px; padding-bottom: 3px; padding-top: 7px;">Hello There!</td>
                                                    </tr>
                                                    <tr>
                                                    <td style="direction:ltr;text-align:left;">
                            
                            
                            
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="280" align="left" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td>
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" class="t5of12 layout" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; max-width: 280px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                                        <tbody><tr>
                                            <td style="direction:ltr;text-align:left;font-size: 1px; height: 1px; line-height: 1px; padding-left: 0px !important; padding-right: 0px !important;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                    <tbody><tr>
                                                    <td class="p2" style="direction:ltr;text-align:left;color: #000000; font-family: 'UberMoveText-Regular', 'HelveticaNeue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 22px; padding-bottom: 12px; padding-top: 7px;"><p>You are receiving this because you, <b style="color:#f00">or someone else</b>, have requested to reset your password on Firstclassbrain. Click on the link below to reset your password. If it doesn't redirect you to the Reset Password page on Firstclassbrain, copy and paste the link into your browser<br /><br />
                                                    <a href="http://firstclassbrain.com/reset-password/${token}" style="color:teal;">http://firstclassbrain.com/reset-password/${token}</a>
                                                    <br /><br />
                                                    Ignore this mail if this wasn't requested directly by you!</p>
                            </td>
                                                    </tr>
                                                </tbody></table>
                                            </td>
                                        </tr>
                                        </tbody></table>
                                        <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                </tr>
                            </table>
                            <![endif]-->
                                                    </td>
                                                    </tr>
                                                </tbody></table>
                                            </td>
                                        </tr>
                                        </tbody></table>
                                        <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                </tr>
                            </table>
                            <![endif]-->
                            
                            
                            
                            <!--[if mso]></td>
                            <td valign="top">
                                <![endif]-->
                            
                            
                            
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="224" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;vertical-align:middle;">
                                <tr>
                                    <td>
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" class="t4of12" style="border: none; border-collapse: collapse; border-spacing: 0; display: inline-block; max-width: 224px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: middle; width: 100%;">
                                        <tbody><tr>
                                            <td class="desktopContent" style="direction:ltr;text-align:left;padding-bottom: 15px; padding-left: 12px; padding-right: 12px; padding-top: 15px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                                                    <tbody><tr>
                                                    <td style="direction:ltr;text-align:left;">
                                                        <div class="desktopContent">
                                                        <img src="https://extras.firstclassbrain.com/password.jpg" width="200" height="" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-width: 200px; outline: none; text-decoration: none; width: 100%; border:20px teal solid;" border="0" alt="">
                                                        </div>
                                                    </td>
                                                    </tr>
                                                </tbody></table>
                                            </td>
                                        </tr>
                                        </tbody></table>
                                        <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                </tr>
                            </table>
                            <![endif]-->
                            
                            
                            
                            
                            
                            
                                                    </td>
                                                    </tr>
                                                </tbody></table>
                                            </td>
                                        </tr>
                                        </tbody></table>
                                        <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                </tr>
                            </table>
                            <![endif]-->
                            
                            
                            
                            
                                            </td>
                                        </tr>
                                        </tbody></table>
                                    </td>
                                </tr>
                            </tbody></table>
                            
                            <div class="mobileContent" style="display: none; mso-hide: all;">
                            <img src="https://extras.firstclassbrain.com/dashboard.jpg" height="" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-width: 100%; outline: none; text-decoration: none; width: 100%; border-top:20px teal solid; border-bottom:20px teal solid; margin-bottom:20px;" border="0" alt="">
                            </div>
                            
                            
                            <!-- close mod2 mt_2019/10/23  -->
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!-- END LIST-->
                            </td>
                            </tr>
                            <!-- END BODY-->
                            </tbody>
                            </table>
                            <!-- footer update july 31 2019  cf    -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #000000; border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" data-blockuuid="be0d7749-5ff0-40a5-834d-5b24a842477c">
                            <tbody>
                            <tr>
                            <td class="outsidegutter" align="left" style="direction:ltr;text-align:left;padding: 0 14px 0 14px;">
                            <table border="0" cellpadding="0" cellspacing="0" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;" class="">
                            <tbody>
                            
                            <!-- Top half -->
                            <tr>
                            <td style="direction:ltr;text-align:left;padding-top: 30px; padding-bottom: 30px;">
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td>
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="t10of12" align="center" style="Margin: 0 auto; border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                            <tbody><tr>
                            <td style="direction:ltr;text-align:left;padding-left: 0; padding-right: 0;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; direction: rtl; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                            <tbody><tr>
                            <td class="ignoreTd" style="font-size:0; text-align: left ">
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="560" align="left" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td width="224">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="t5of12" style="border: none; border-collapse: collapse; border-spacing: 0; direction: ltr; display: inline-block; max-width: 224px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: top; width: 100%;">
                            <tbody><tr>
                            <td style="direction:ltr;text-align:left;padding-left: 12px; padding-right: 12px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                            <tbody><tr>
                            <td style="direction:ltr;text-align:left;">
                            
                            
                            
                            
                            
                            </td>
                            </tr>
                            </tbody></table>
                            </td>
                            </tr>
                            </tbody></table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            
                            
                            </td>
                            </tr>
                            </tbody></table>
                            </td>
                            </tr>
                            </tbody></table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                            
                            </td>
                            </tr>
                            <!-- END top half -->
                            
                            
                            
                            
                            
                            
                            
                            <!-- bottom half -->
                            <tr>
                            <td style="direction:ltr;text-align:left; padding-bottom: 30px;">
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="560" align="center" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td width="560">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="t10of12" align="center" style="Margin: 0 auto; border: none; border-collapse: collapse; border-spacing: 0; max-width: 560px; mso-table-lspace: 0; mso-table-rspace: 0; width: 100%;">
                            <tbody><tr>
                            <td style="direction:ltr;text-align:left;padding-left: 0; padding-right: 0;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; direction: rtl; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                            <tbody><tr>
                            <td class="ignoreTd" style="font-size:0; text-align: left">
                            <!--[if (gte mso 9)|(IE)]>
                            <table width="560" align="left" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                            <td width="224">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="t4of12" style="border: none; border-collapse: collapse; border-spacing: 0; direction: ltr; display: inline-block; max-width: 224px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: top; width: 100%;">
                            <tbody><tr>
                            <td style="direction:ltr;text-align:left;padding-left: 12px; padding-right: 12px;">
                            <table border="0" cellpadding="0" cellspacing="0" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; ">
                            <tbody><tr>
                            <td class="p3 white" style="padding-bottom: 12px; direction:ltr;text-align:left;">
                            
                            <!-- social table -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 130px;">
                            <tbody>
                            <tr>
                            <td width="43" align="center" style="direction: ltr; text-align: left;">
                            <a href="https://www.linkedIn.com/company/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/facebook-icon.svg" width="13" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 13px; outline: none; text-decoration: none; width: 100%;">
                            </a>
                            </td>
                            <td width="43" align="center" style="direction: ltr; text-align: left;">
                            <a href="https://mobile.twitter.com/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/twitter-icon.svg" width="19" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 19px; outline: none; text-decoration: none; width: 100%;">
                            </a>
                            </td>
                            <td width="43" align="center" style="direction: ltr; text-align: left;">
                            <a href="https://www.linkedIn.com/company/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/linkedin-icon.svg" width="19" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 19px; outline: none; text-decoration: none; width: 100%;">
                            </a>
                            </td>
                            <td width="43" align="center" style="direction: ltr; text-align: left;">
                            <a href="https://www.instagram.com/firstclassbrain" target="_blank"> <img src="https://extras.firstclassbrain.com/instagram-icon.svg" width="16" height="" border="0" style="-ms-interpolation-mode: bicubic; clear: both; display: block; height: auto; max-height: 17px; max-width: 16px; outline: none; text-decoration: none; width: 100%;">
                            </a>
                            </td>
                            </tr>
                            </tbody></table>
                            <!-- END social table -->
                            
                            </td>
                            </tr>
                            </tbody></table>
                            </td>
                            </tr>
                            </tbody></table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            <td width="336">
                            <![endif]-->
                            <table border="0" cellpadding="0" cellspacing="0" class="t6of12" style="border: none; border-collapse: collapse; border-spacing: 0; direction: ltr; display: inline-block; max-width: 336px; mso-table-lspace: 0; mso-table-rspace: 0; vertical-align: top; width: 100%;">
                            <tbody><tr>
                            <td style="direction:ltr;text-align:left;padding-left: 12px; padding-right: 12px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" align="left" style="border: none; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0; mso-table-rspace: 0; table-layout: fixed; width: 100%;">
                            <tbody><tr>
                            <td class="p2" style="direction:ltr;text-align:left;color: #e5e5e5; font-family: 'UberMoveText-Regular', 'HelveticaNeue', Helvetica, Arial, sans-serif; font-size: 10px; line-height: 18px;">
                                <a className="link" target="_blank" href="tel:+2349074554735" style="text-decoration: none; color: #e5e5e5">
                                    +234-(0)907-455-4735,
                                </a>
                                <br />
                                <a className="link" target="_blank" href="mailto:hello@firstclassbrain.com" style="text-decoration: none; color: #e5e5e5">
                                    hello@firstclassbrain.com
                                </a>
                                <br>
                                <a className="link" target="_blank" href="https://goo.gl/maps/mMbMwrJQVxoRrb1R8" rel="noopener noreferrer" target="_blank" style="text-decoration: none; color: #e5e5e5">
                                    No. 27, Olayiwola Street, New Oko-oba, Lagos State
                                </a>
                                <br>
                                <a target="_blank" href="https://firstclassbrain.com/" style="text-decoration: none; color: #e5e5e5">Firstclassbrain.com</a>
                            
                            </td>
                            </tr>
                            </tbody></table>
                            </td>
                            </tr>
                            </tbody></table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                            </td>
                            </tr>
                            </tbody></table>
                            </td>
                            </tr>
                            </tbody></table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                            </td>
                            </tr>
                            <!-- END bottom half -->
                            
                            
                            
                            </tbody></table>
                            </td>
                            </tr>
                            
                            
                            </tbody></table>
                            <!-- close footer update - ces -->
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            <!--[if (gte mso 9)|(IE)]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                            </td>
                            </tr>
                            </tbody>
                            </table>
                            
                            
                                
                                
                            </body>
                    </html>`
                }

                passwordTransporter.sendMail(mailOptions, (error, info) => {
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

router.put('/admin/coupon', requireAdminLogin, (req,res) => {

    const { subInterval, email } = req.body

    if( !subInterval || !email ){
        return res.status(422).json({error: "Please add all the fields"})
    }

    Student.findOne({email})
        .select("-password")
        .then((student) => {

            if(!student){
                return res.status(422).json({error:"User not a student..."})
            }

            switch (subInterval) {

                case "weekly":
                    student.expiryDate = moment().add(7, 'days').calendar()
                    student.paid = true
                    student.save().then((savedstudent)=>{
                        console.log(savedstudent)
                        const newdate = new Date(savedstudent.expiryDate)
                        console.log('Expiry', newdate.toDateString())
                        res.json({message:"Subscription added...", savedstudent})
                    })
                    break;

                case "monthly":
                    student.expiryDate = moment().add(30, 'days').calendar()
                    student.paid = true
                    student.save().then((savedstudent)=>{
                        console.log(savedstudent)
                        const newdate = new Date(savedstudent.expiryDate)
                        console.log('Expiry', newdate.toDateString())
                        res.json({message:"Subscription added...", savedstudent})
                    })
                    break;

                case "yearly":
                    student.expiryDate = moment().add(365, 'days').calendar()
                    student.paid = true
                    student.save().then((savedstudent)=>{
                        console.log(savedstudent)
                        const newdate = new Date(savedstudent.expiryDate)
                        console.log('Expiry', newdate.toDateString())
                        res.json({message:"Subscription added...", savedstudent})
                    })
                    break;

                default:
                    res.json({err: "Interval not valid..."})
                
            }
        })
        .catch(err => console.log(err))

})


// delete instructors and students
router.get('/student-details/:postId', (req, res) => {
    Student.findOne({_id: req.params.postId})
    .then(student => {
        Student.find({postId: req.params.postId})
        .populate("postedBy", "_id firstName")
        .exec((err, students) => {
            if(err){
                return res.status(422).json({error: err})
            }
            res.json({student, students})
        })
    }).catch(err => {
        return res.status(404).json({error: "Student not found"})
    })
})

router.delete('/delete-student/:postId', (req, res) => {
    Student.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, student) => {
        if(err || !student){
            return res.status(422).json({error: err})
        }
        student.remove()
        .then(result => {
            res.json({message: "successfully deleted"})
        }).catch(err => {
            console.log(err)
        })
    })
})

router.delete('/delete-instructor/:postId', (req, res) => {
    Instructor.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, instructor) => {
        if(err || !instructor){
            return res.status(422).json({error: err})
        }
        instructor.remove()
        .then(result => {
            res.json({message: "successfully deleted"})
        }).catch(err => {
            console.log(err)
        })
    })
})


module.exports = router
