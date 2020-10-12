const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const PORT = process.env.PORT || 5000
const cors = require("cors")
const {MONGOURI} = require('./config/keys')

mongoose.connect(MONGOURI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected', () => {
    console.log("Connected to mongo")
})
mongoose.connection.on('error', () => {
    console.log("Error connecting", err)
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

app.use(cors())
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/courses'))
app.use(require('./routes/tests'))

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
