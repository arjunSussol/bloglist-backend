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

module.exports = { dummy, totalLikes, favoriteBlog };