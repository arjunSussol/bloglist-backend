const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URL;
console.log('connecting to url');

mongoose
	.connect(url)
	.then(() => console.log('connected to Mongo DB'))
	.catch((error) => console.log('error connecting to Mongo DB', error));

const blogSchema = Schema({
	title: String,
	author: String,
	url: String,
	likes: Number
});

blogSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Blog', blogSchema);
