/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()
import createError from 'http-errors'
import express from 'express'
import favicon from 'express-favicon'
import path from 'path'
import bodyParser from 'body-parser'
import logger from 'morgan'
import passport from './middleware/passport'
import serveGzipped from './middleware/gzip'
import bearerToken from 'express-bearer-token'
import { pick } from 'underscore'
import authRoute from './routes/auth'

class App {
  public instance: express.Application

  constructor() {
    this.instance = express()
    this.instance.use(require('./middleware/helmet'))
    this.instance.use(favicon(path.join(__dirname, 'public/images/favicon/favicon.ico')))
    this.instance.use(logger('dev'))
    this.instance.use(express.json())
    this.instance.use(express.urlencoded({ extended: false }))
    this.instance.use(bodyParser.json())
    this.setupSession()
    this.setupViewEngine()
    this.setupAssets()
    this.setupAuth()
    this.setupGraphQL()
    this.setupRoutes()
    this.setupErrorHandling()
    this.instance.disable('view cache')
  }

  /**
   * Setup sessions
   */
  setupSession() {
    this.instance.use(require('./middleware/session'))
  }

  /**
   * Setup view engine
   */
  setupViewEngine() {
    this.instance.set('views', path.join(__dirname, 'views'))
    this.instance.set('view engine', 'hbs')
  }

  /**
   * Setup static assets
   */
  setupAssets() {
    this.instance.use('/*.js', serveGzipped('text/javascript'))
    this.instance.use(express.static(path.join(__dirname, 'public')))
  }

  /**
   * Setup authentication
   */
  setupAuth() {
    this.instance.use(bearerToken())
    this.instance.use(passport.initialize())
    this.instance.use(passport.session())
    this.instance.use('/auth', authRoute)
  }

  /**
   * Setup graphql
   */
  setupGraphQL() {
    const server = require('./api/graphql')
    server.applyMiddleware({
      app: this.instance,
      path: '/graphql',
    })
  }

  /**
   * Setup routes
   */
  setupRoutes() {
    const index = express.Router()
    index.get('/', (req, res) => {
      res.render('index')
    })
    this.instance.use('*', index)
  }

  /**
   * Setup error handling
   */
  setupErrorHandling() {
    this.instance.use((_req, _res, next) => {
      next(createError(404))
    })
    this.instance.use((error: any, _req: express.Request, res: express.Response) => {
      res.status(error.status || 500)
      res.render('index', { error: JSON.stringify(pick(error, 'name', 'message', 'status')) })
    })
  }
}

export default new App()
