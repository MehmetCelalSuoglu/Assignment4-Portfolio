// server/express.js
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template.js'

import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import contactRoutes from './routes/contact.routes.js'
import projectRoutes from './routes/project.routes.js'
import educationRoutes from './routes/education.routes.js'
import chatRoutes from "./routes/chat.routes.js";

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())

const uploadsPath = path.join(__dirname, 'uploads')

app.use('/uploads', express.static(uploadsPath))

// robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(
    [
      'User-agent: *',
      'Allow: /'
    ].join('\n')
  );
});


app.use('/', authRoutes)
app.use('/', userRoutes)
app.use('/', contactRoutes)
app.use('/', projectRoutes)
app.use('/', educationRoutes)
app.use("/", chatRoutes);

const clientBuildPath = path.join(__dirname, '../client/dist')

app.use(express.static(clientBuildPath))

app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next()
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'))
})

export default app
