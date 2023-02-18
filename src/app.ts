import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import express from 'express'
import cookieParser from 'cookie-parser'
import cors, { type CorsOptions } from 'cors'
import morgan from 'morgan'
import passport from 'passport'

import JWTStrategy from './middleware/passportJWT.middleware.js'

const app = express()

const __dirname = dirname(fileURLToPath(import.meta.url))
const uploadsFolderPath = join(__dirname, '../', 'uploads')

const corsConfig: CorsOptions = {
  origin: 'http://localhost:8080',
  credentials: true,
}

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsConfig))
app.use(morgan('dev'))

JWTStrategy(passport)

app.use('/uploads', express.static(uploadsFolderPath))

export { app as default }
