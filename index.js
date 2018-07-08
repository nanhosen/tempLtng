const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const cors = require('cors')
const nocache = require('nocache')
const compression = require('compression')
const keys = require('./config/keys')

require('./models/User')
require('./services/passport')

mongoose.connect(keys.mongoURI)
const app = express()


app.use(nocache())
app.use(compression())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(passport.initialize())
app.use('/data',
	// passport.authenticate('jwt', { session: false }), 
	express.static('./data')
)

require('./routes/authRoutes')(app)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`listening on port`, PORT)
})