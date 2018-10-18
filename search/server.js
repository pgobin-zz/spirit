const express = require('express')
const app = express()

const headers = (req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // res.setHeader('Access-Control-Allow-Credentials', 'true');
  // res.setHeader('Access-Control-Allow-Origin', '*');

  // res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  // res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  // res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  next();
}

app.disable('x-powered-by')
app.set('json spaces', 2)
app.use(express.json());
app.use(headers);
app.use('/', require('./routes'))

app.get('*', (req, res) => {
  res.status(400).send({ error: 'Unsupported request' })
})

app.listen(7000, () => console.log('LISTENING PORT: 6666'));
