const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

// telling server where to find static files
app.use('/', express.static(path.join(__dirname, '/public')))

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

app.listen(PORT, ()=>{
    console.log(`Server listenning on port ${PORT}`)
})