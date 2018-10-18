import express from 'express'
import {
  app,
  server,
  greet,
  headers,
  handleError
} from './config'
import io from './io'


app.use(headers)
app.use(express.json())
app.use(handleError)


server.listen(process.env.PORT, () => greet())
