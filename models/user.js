const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = Schema({
	username: String,
	name: String,
	passwordHash: String,
	blogs: [{
		type: Schema.Types.ObjectId,
		ref: 'Blog'
	}]
});

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash; // The passwordHash should not be revealed
	}
});

module.exports = mongoose.model('User', userSchema);