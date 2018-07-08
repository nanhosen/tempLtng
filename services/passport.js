const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const GoogleStrategy = require('passport-google-oauth20').Strategy
const {	
	googleClientID: clientID,
	googleClientSecret: clientSecret,	
	secretOrKey, 
	expiresIn 
} = require('../config/keys')
let mongoose = require('mongoose')
const User = mongoose.model('User')

passport.use(new GoogleStrategy(
	{ 
		clientID,
		clientSecret,
		callbackURL: '/auth/google/callback',
		proxy: true // need for google console to trust nowjs https proxy for callback
	},
	async (accessToken, refreshToken, profile, done) => {
		try {
			const email = profile.emails[0].value
			const currentUser = await User.findOne({ googleId: profile.id })
			if (currentUser) { return done(null, currentUser) }
			else { 
				const newUser = await new User({ email, googleId: profile.id }).save()
				done(null, newUser)
			}
		}
		catch(err) { done(err, false) }
	}
))

passport.use(new JwtStrategy(
	{
		jwtFromRequest: ExtractJwt.fromHeader('authorization'),
		secretOrKey,
		jsonWebTokenOptions: { expiresIn },
		// issuer: keys.issuer,
		// audience: keys.audience
	},
	async (payload, done) => {
		try {
			await User.findById(payload.userId, (err, user) => {
				if (err) { 
					return done(err, false)
				 }
				else if (user) { done(null, user) }
				else { done(null, false) }
			})
		}
		catch(err) {
			done(err, false)
		}
	}
))