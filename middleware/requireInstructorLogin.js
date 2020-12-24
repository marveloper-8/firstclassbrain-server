const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const Instructor = mongoose.model("Instructor")

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

        role !== "Instructor" ? res.status(401).json({error: "User not a instructor..."}) : null

        Instructor.findById(_id).then(instructorData => {
            req.instructor = instructorData
            next()
        })
    })
}