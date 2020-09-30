const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    classSelected: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    department:{
        type: String
    },
    term: {
        type: String,
        requred: true
    },
    week: {
        type: String,
        requred: true
    },
    // dateUnlock: {
    //     type: Date,
    //     requred: true
    // },
    courseTitle: {
        type: String,
        required: true
    },
    courseThumbnail: {
        type: String,
        default:"https://res.cloudinary.com/cnq/image/upload/v1586197723/noimage_d4ipmd.png"
    },
    firstTextSlide: {
        type: String,
        required: true
    },
    firstImageSlide: {
        type: String,
        required: false
    },
    secondTextSlide: {
        type: String,
        required: true
    },
    secondImageSlide: {
        type: String,
        required: false
    },
    thirdTextSlide: {
        type: String,
        required: true
    },
    thirdImageSlide: {
        type: String,
        default:"https://res.cloudinary.com/cnq/image/upload/v1586197723/noimage_d4ipmd.png"
    },
    fourthTextSlide: {
        type: String,
        required: true
    },
    fourthImageSlide: {
        type: String,
        default:"https://res.cloudinary.com/cnq/image/upload/v1586197723/noimage_d4ipmd.png"
    },
    paid: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            type: ObjectId,
            ref: "Admin"
        }
    ],
    comments: [{
        text:String,
        postedBy:{
            type: ObjectId,
            ref: "Admin"
        }
    }],
    postedBy: {
        type: ObjectId,
        ref: "Admin"
    }
}, {timestamps: false})

mongoose.model("Post", postSchema)
