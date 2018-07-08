let mongoose = require('mongoose')
let Schema = mongoose.Schema; 

const userSchema = new Schema({
	email: {
		type: String,
		required: [true, 'email required'],
		unique: [true, 'email already registered']
	},
	googleId: {
		type: String,
		default: null
	}
})

module.exports = mongoose.model('User', userSchema)