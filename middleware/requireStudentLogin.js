const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const Student = mongoose.model("Student")

module.exports = (req, res, next) => {
    const {authorization} = req.headers

    if(!authorization){
        return res.status(401).json({error: "You must be logged in..."})
    }

    const token = authorization.replace("Bearer ", "")

    jwt.verify(token, JWT_SECRET, (err, payload) => {

        if(err){
            return res.status(401).json({error: "Token expired..."})
        }

        const {_id, role} = payload

        role !== "Student" ? res.status(401).json({error: "User not a student..."}) : null

        Student.findById(_id).then(studentData => {
            req.student = studentData
            next()
        })
    })
}