import express from 'express'
import router from './routes'
import passport from './utils/passport'
import { greet, headers, handleError } from './config'
import { validateToken, refreshToken, createToken } from './utils/jwt'
import { schema } from './schema'



const app = express()
app.set('json spaces', 2)
app.disable('x-powered-by')


app.use(headers)
app.use(passport.initialize())
app.use(express.json())

app.use(validateToken())
app.use(refreshToken)

app.use('/v1.0', router)

app.use(createToken)
app.use(handleError)


app.get('*', (req, res) => schema(res, 400, 'Unsupported request'))
app.listen(process.env.PORT, () => greet())
