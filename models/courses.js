const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    classSelected: {
        type: Number,
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
        type: Number,
        requred: true
    },
    week: {
        type: Number,
        requred: true
    },
    courseTitle: {
        type: String,
        required: true
    },
    video: {
        type: String,
        default: "https://extras.firstclassbrain.com/pexels-videos-4552_49cII0mc.mp4"
    },
    courseThumbnail: {
        type: String,
        default:"https://extras.firstclassbrain.com/online-course.png"
    },
    firstTextSlide: {
        type: String,
        required: true
    },
    firstImageSlide: {
        type: String,
        default:"https://extras.firstclassbrain.com/add-image.png"
    },
    secondTextSlide: {
        type: String,
        required: true
    },
    secondImageSlide: {
        type: String,
        default:"https://extras.firstclassbrain.com/add-image.png"
    },
    thirdTextSlide: {
        type: String,
        required: true
    },
    thirdImageSlide: {
        type: String,
        default:"https://extras.firstclassbrain.com/add-image.png"
    },
    fourthTextSlide: {
        type: String,
        required: true
    },
    fourthImageSlide: {
        type: String,
        default:"https://extras.firstclassbrain.com/add-image.png"
    },
    pdf:{
        type: String,
        default: "Upload PDF"
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
