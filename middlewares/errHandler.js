const {logEvents}= require('../middlewares/logger')

const errHandler = (err, req, res, next) => {
    logEvents(`${err.name}:\t${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLogs.log')
    console.log(`${err.stack}`)

    const status = err.status ? err.status : 500 // server error

    res.json({message: err.message})
}

module.exports = errHandler