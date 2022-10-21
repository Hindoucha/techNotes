const {format} = require('date-fns')
const {v4: uuid} = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, logFileName) => {
    const dateItem = format(new Date(), 'dd/MM/yyyy\thh:mm:44')
    const logItem = `${dateItem}\t${uuid()}\t${message}\n`
    
   try {
        if(!fs.existsSync(path.join(__dirname, '..','logs'))) {
            console.log('path do not exist')
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fs.promises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    
    } catch (error) {
        console.log(error)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLogs.log')
    console.log(`${req.method} ${req.url}`)
    next()
}

module.exports = {logEvents, logger}