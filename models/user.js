const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = Schema({
	username: {
		type: String,
		validate: {
			validator: async function(username) {
				const user = await this.constructor.findOne({ username });
				if (user) {
					return this.id === user.id ? true : false;
				}
				return true;
			},
			message: props => `${props.value} must be unique.`
		},
		required: [true, 'Username is required'],
		minLength: [3, 'Username must be at least 3 characters long, got {VALUE}']
	},
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