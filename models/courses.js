const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    classSelected: {
        type: Number
    },
    subject: {
        type: String
    },
    department:{
        type: String
    },
    term: {
        type: Number
    },
    week: {
        type: Number
    },
    courseTitle: {
        type: String
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
        type: String
    },
    firstImageSlide: {
        type: String,
        default:"https://extras.firstclassbrain.com/add-image.png"
    },
    secondTextSlide: {
        type: String
    },
    secondImageSlide: {
        type: String,
        default:"https://extras.firstclassbrain.com/add-image.png"
    },
    thirdTextSlide: {
        type: String
    },
    thirdImageSlide: {
        type: String,
        default:"https://extras.firstclassbrain.com/add-image.png"
    },
    fourthTextSlide: {
        type: String
    },
    fourthImageSlide: {
        type: String,
        default:"https://extras.firstclassbrain.com/add-image.png"
    },
    pdf:{
        type: String,
        default:"https://extras.firstclassbrain.com/abc_packet.pdf"
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
