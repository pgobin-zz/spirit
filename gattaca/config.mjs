import http from 'http'
import express from 'express'
import figlet from 'figlet'



export const greet = () => {
  const options = { font: 'Calvin S' }
  figlet.text('GATTACA', options, (err, data) => {
    if (err) return
    console.log(`\n\x1b[37m${data}\n`)
    console.log(`\x1b[32mspirit//chat v${process.env.VERSION}`)
    console.log(`\x1b[35mLISTENING ON \x1b[31m${process.env.PORT}\n`)
  })
}



const app = express()
const server = http.createServer(app)
const secret = process.env.JWT_SECRET



/**
 *
 *
 */
const headers = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  return next()
}



/**
 *
 *
 *
 * @param err
 * @param req
 * @param res
 * @param next
 *
 */
const handleError = (err, req, res, next) => {
  console.error(err.stack)
  return res.status(500).send(err.stack)
}



export {
  app,
  server,
  secret,
  headers,
  handleError
}
