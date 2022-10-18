require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

const {logger, logEvents} = require('./middlewares/logger')
const corsOptions = require('./config/corsOptions')
const errHandler = require('./middlewares/errHandler')
const connectDB = require('./config/dbConn')

const app = express()
const PORT = process.env.PORT || 3001
console.log(process.env.NODE_ENV)

// connecting to db
connectDB()

// MIDDLEWARES
// custum
app.use(logger)
// built-in
app.use(express.json())
// built-in : telling server where to find static files
app.use('/', express.static(path.join(__dirname, 'public')))
// 3rd party
app.use(cors(corsOptions))
app.use(cookieParser())


// ROUTES
// where to find other normal routes
app.use('/', require('./routes/root'))

app.all('*', (req, res)=> {
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if(req.accepts('json')) {
        res.json({message : '404 Not found'})
    }
    else {
        res.type('.text').send('404 Not found')
    }
})

// err handler middleware
app.use(errHandler)

mongoose.connection.once('open', () => {
    console.log('connected to mongodb')
    app.listen(PORT, () => { console.log(`Server listenig on port ${PORT}`)})
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLogs.log')
})