const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const swaggerUI = require('swagger-ui-express')
const app = express()
// const cron = require('node-cron')
const PORT = process.env.PORT || 5000
const cors = require("cors")
const {MONGOURI} = require('./config/keys')
const swaggerDocument = require('./swagger.json')


const fileUpload = require('express-fileupload')
app.use(express.static('public')); //to access the files in public folder
app.use(fileUpload())

mongoose.connect(MONGOURI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected', () => {
    console.log("Connected to mongo")
})
mongoose.connection.on('error', () => {
    console.log("Error connecting")
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

require('./models/student')
require('./models/instructor')
require('./models/admin')
require('./models/courses')
require('./models/tests')
require('./models/test_score')
require('./models/test_item')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/courses'))
app.use(require('./routes/tests'))
app.use(require('./routes/paystack'))
app.use(require('./routes/test_score'))
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))


app.post('/upload', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
        // accessing the file
    const myFile = req.files.file;
    //  mv() method places the file inside public directory
    myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        return res.send({name: myFile.name, path: `/${myFile.name}`});
    });
})

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, () => {
    console.log("server is running on ", PORT)
})
