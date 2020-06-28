require('dotenv').config()
const createError = require('http-errors')
const express = require('express')
const path = require('path')

const cookieParser = require('cookie-parser')
const logger = require('morgan')
const Config = require('./helpers/config')
const config = new Config(process.env.CONFIG_FILE)

const { devices } = require('./models/devices')(config)
const { playbooks } = require('./models/playbooks')(config, devices)

const indexRouter = require('./routes/index')
const app = express()

app._config = config
app._filesPath = path.join(__dirname, 'public', 'files')
app._playbooks = playbooks
app._devices = devices

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
