const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const {logger} = require('./middlewares/logger')
const corsOptions = require('./config/corsOptions')
const errHandler = require('./middlewares/errHandler')

const app = express()
const PORT = process.env.PORT || 3001


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

app.listen(PORT, ()=>{
    console.log(`Server listenning on port ${PORT}`)
})