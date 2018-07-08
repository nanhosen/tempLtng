const jwt = require('jsonwebtoken') 
const User = require('../models/User')
const { secretOrKey, expiresIn } = require('../config/keys')

// check if Token exists on request header and attach token to request as attribute
exports.checkTokenMW = (req, res, next) => {
	// get auth header value
	const header = req.headers['authorization']
	if (typeof header !== 'undefined') {
		req.token = header
		next()
	}
	else { res.sendStatus(403) }
}

// verify token validity and attach token data as request attribute
exports.verifyToken = (req, res) => {
	jwt.verify(req.token, config.jwtSecret, (err, authData) => {
		if (err) { res.sendStatus(403) }
		else { return req.authData = authData }
	})
}

// Issue Token
exports.signToken = (req, res) => {
	jwt.sign(
		{ userId: req.user._id },
		secretOrKey,
		{ expiresIn, },
		(err, token) => {
			console.log(token)
			if (err) { res.sendStatus(500) }
			else { res.redirect(`http://localhost:8081/?token=${token}`) }
		}
	)
}

// const uri = window.location.toString()
// const cleanUri = uri.substring(uri.indexOf("?token=")+7).slice(0, -1)
// localStorage.setItem("token", cleanUri)