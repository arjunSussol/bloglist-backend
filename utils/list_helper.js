const _ = require('lodash');

const dummy = blogs => {
	return 1;
};

const totalLikes = blogs => {
	let totalLike;
	switch(blogs.length) {
	case 0:
		totalLike = 0;
		break;
	case 1:
		totalLike = blogs[0].likes;
		break;
	default:
		totalLike = blogs.reduce((accumulater, currentValue) => accumulater + currentValue.likes, 0);
	}

	return totalLike;
};

const favoriteBlog = blogs => {
	const topBlog = blogs.sort((a, b) => b.likes - a.likes )[0];
	return topBlog;
};

const mostByAuthor = blogs => {
	const groupByAuthor = _.groupBy(blogs, 'author');
	let mostAuthor = [];
	for (const author in groupByAuthor) {
		let totalLikes = groupByAuthor[author].reduce((total, value) => total + value.likes, 0);
		mostAuthor.push({ 'author': author, 'blogs': groupByAuthor[author].length, 'likes': totalLikes });
	}

	return mostAuthor;
};

const mostBlogs = blogs => {
	return mostByAuthor(blogs).sort((a, b) => b.blogs - a.blogs)[0];
};

const mostLikes = blogs => mostByAuthor(blogs).sort((a, b) => b.likes - a.likes)[0];

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };