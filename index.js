const express = require('express')
const mongoose = require('mongoose')
const config = require('./config')
const bodyParser = require('body-parser')
const errorhandler = require('errorhandler')
const server = express()

server.listen(config.PORT, () => {
  mongoose.connect(config.MONGODB_URI, { dbName: 'data', useNewUrlParser: true })
})

// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
server.use(bodyParser.json())
if (process.env.NODE_ENV === 'development') {
  server.use(errorhandler)
}
const db = mongoose.connection
db.on('error', err => console.log(err))
db.once('open', () => {
  console.log('Database successfully connected')
  require('./routes/auth')(server)
  require('./routes/posts')(server)
  require('./routes/categories')(server)
  require('./routes/comments')(server)
  console.log('Server listening on port: ' + config.PORT)
})