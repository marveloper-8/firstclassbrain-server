data = {
    name: 'Test',
    test: [
        {
            id: 1
        },

        {
            id: 2
        },

        {
            id: 3
        }
    ]
}

state = {
    name: 'test',
    test: []
}

/** from frontend **/
setState(prev => ({...prev, test: [...prev.test, new_object]}))

sendToBackend(state)

/** from backend **/
function data(request){
    dbname = request.name
    request.course.forEach(course => {
        dbcourseId = course.id
        dbcourseTitle = course.title
    });
}



const uploadFields = () => {
    fetch("/upload-course", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            classSelected,
            subject,
            term,
            test
        })
    }).then(res => res.json())
        .then(data => {
            if(data.error){
                alert(data.error)
            }
            else{
                alert("Uploaded Successfully")
                history.push('/courses')
            }
        })
        .catch(err => {
            console.log(err)
        })
}
const PostUpload = () =>{
    if(image){
        uploadPic()
    }else{
        uploadFields()
    }
}




router.get('/all-courses', (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id firstName")
        .then(posts => {
            res.json({posts})
        })
        .catch(err => {
            console.log(err)
        })
})


Test: {
    classSelected,
    topic,
    questions:{
        questionContent,
        answers:{
            one,
            two,
            three
        }
    }
}


router.post('/upload-course', (req, res) => {
    const {
        classSelected,
        subject,
        term,
        week,
        courseTitle,
        video,
        test,
        firstTextSlide,
        secondTextSlide,
        thirdTextSlide,
        fourthTextSlide,
        courseThumbnail,
        firstImageSlide,
        secondImageSlide,
        thirdImageSlide,
        fourthImageSlide
    } = req.body
    if(!classSelected || !subject || !term || !week || !courseTitle || !video || !firstTextSlide || !secondTextSlide || !thirdTextSlide || !fourthTextSlide || !firstImageSlide || !secondImageSlide){
        return res.status(422).json({error: "Please add all the fields"})
    }

    // req.admin.password = undefined
    
    const post = new Post({
        classSelected,
        subject,
        term,
        week,
        video,
        courseTitle,
        firstTextSlide,
        secondTextSlide,
        thirdTextSlide,
        fourthTextSlide,
        courseThumbnail,
        firstImageSlide,
        secondImageSlide,
        thirdImageSlide,
        fourthImageSlide,
        postedBy: req.admin
    })
    post.save().then(result => {
        return res.json({post: result})
    })
    .catch(err => {
        console.log(err)
    })

    test.forEach(item => {
        const {question, answers, solution} = item
        const uploadTest = new Test({
            post,
            term,
            question,
            subject,
            term,
            week,
        })

        uploadTest.save().then(result => {
            return res.json({post: result})
        })
        .catch(err => {
            console.log(err)
        })

        answers.forEach()
    })

})

function asignTest(){
    
}

test: [{
    type: Array,
    requred: true
}]