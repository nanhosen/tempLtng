const Path = require('path')
const passport = require('passport')
const requireJwt = passport.authenticate('jwt', { session: false })
const authentication = require('../services/authentication')
const fs = require('fs')


module.exports = app => {
	app.get('/auth/google', passport.authenticate('google', {
			session: false,
			scope: ['profile', 'email'],
			hostedDomain: 'blm.gov'
		})
	)
 
	app.get('/auth/google/callback', passport.authenticate('google', { 
			session: false, 
			failureRedirect: '/auth/google',
			// successRedirect: 'http://localhost:8081/'
		}), 
		(req, res) => authentication.signToken(req, res)
	)


	app.get('/api/config', 
		(req, res, next) => res.json(require('./apiConfig'))
	)
	app.get('/api/test', 
		(req, res, next) => {
			
		}
	)

	// app.get('/api/secure',
	// 	requireJwt,
	// 	(req, res, next) => {
			
	// 		const path = Path.resolve(__dirname, 'test1.csv');
	// 		// console.log()
	// 		const options = {
	// 	    // root: process.env.PWD + '/',
	// 	    // dotfiles: 'deny',
	// 	    lastModified: true,
	// 	    headers: {
	// 	    	'Content-Type': 'text/csv',
	//         'x-timestamp': Date.now(),
	//         'x-sent': true,
	// 	    }
	// 	  }			
	// 	  // res.json({hi: 'there'})
	// 		res.sendFile(path, options, function (err) {
	// 	    if (err) {
	// 	      next(err);
	// 	    } 
	// 	    return
	// 	  })	 
	// 	}
	// )	


	// route to check token with postman.
	// using middleware to check for authorization header
	app.get('/verify', authentication.checkTokenMW,
		(req, res) => {
			authentication.verifyToken(req, res)
			if (null === req.authData) { res.sendStatus(403) }
			else { res.json(req.authData) }
		}
	)

	// app.get('/auth/logout',	(req, res) => {
	// 		req.logout()
	// 		res.redirect('/')
	// 	}
	// )
}