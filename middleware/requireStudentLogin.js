const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const Student = mongoose.model("Student")
// const Admin = mongoose.model("Admin")

module.exports = (req, res, next) => {
    const {authorization} = req.headers

    // authorization === Bearer kjkjjkjj;
    if(!authorization){
        return res.status(401).json({error: "You must be logged in"})
    }

    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if(err){
            return res.status(401).json({error: "You must be logged in"})
        }

        const {_id} = payload

        Student.findById(_id).then(studentData => {
            req.student = studentData
            next()
        })
    })
}