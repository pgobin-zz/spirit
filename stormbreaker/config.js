import figlet from 'figlet'
import driver from 'cassandra-driver'
import stripeInit from 'stripe'
import validate from 'express-validation'
import client from './db'

import { schema } from './schema'


export const greet = () => {
  const options = { font: 'Calvin S' }
  figlet.text('STORMbreaker', options, (err, data) => {
    if (err) return
    console.log(`\n${data}\n`)
    console.log(`\x1b[31mspirit//api v${process.env.VERSION}`)
    console.log(`\x1b[37mLISTENING ON \x1b[33m${process.env.PORT}\n`)
  })
}


export const cassa = client
export const stripe = stripeInit(process.env.STRIPE_SECRET)
export const secret = process.env.JWT_SECRET

// ! DEPRECATED
// export const datatypes = client.datatypes
// export const cassandra = new driver.Client({contactPoints: [process.env.CASSANDRA_CONTACT_POINTS]});
// export const Uuid = driver.types.Uuid;


export const headers = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ASTRA_BASE_URL)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range')
  return next()
}


validate.options({ contextRequest: true })


export const handleError = (err, req, res, next) => {
  if (err instanceof validate.ValidationError) {
    return process.env.NODE_ENV === 'production' ?
      schema(res, 400, 'Unsupported body.') :
      res.status(err.status).send(err)
  }
  console.error(err.stack)

  return process.env.NODE_ENV === 'production' ?
    schema(res, 500, 'Internal server error.') :
    res.status(500).send(err.stack)
}
