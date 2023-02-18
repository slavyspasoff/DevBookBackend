import { env } from 'process'

import mongoose from 'mongoose'

import './dotenv.init.js'
import app from './app.js'

const { PORT, DB_USER, DB_PASS, DB_URI_BASE, BASE_URL } = env as Env

const port = Number(PORT) || 5555

const DB_URI = DB_URI_BASE.replace('<username>', DB_USER).replace(
  '<password>',
  DB_PASS
)

mongoose.set('strictQuery', true)
mongoose
  .connect(DB_URI)
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
