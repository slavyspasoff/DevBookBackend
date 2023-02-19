import { env } from 'process'

import mongoose from 'mongoose'

import './dotenv.init.js'
import app from './app.js'

const { PORT, DB_USER, DB_PASS, DB_URL_BASE, BASE_URL } = env as Env

const port = Number(PORT) || 5555

const DB_URL = DB_URL_BASE.replace('<username>', DB_USER).replace(
  '<password>',
  DB_PASS
)

mongoose.set('strictQuery', false)
mongoose
  .connect(DB_URL)
  .then((M) => {
    console.log(`Connected to ${M.connection.name} database`)
  })
  .catch((err: Error) => {
    console.log(
      `Connection to the database failed with an error message: \n ${err.message}`
    )
  })

const server = app.listen(port, () => {
  console.log(`Server listening on ${BASE_URL}`)
})
