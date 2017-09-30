const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');

module.exports = (request, response, next) => {

	if (!request.headers.authorization) {
		return response.status(401).end();
	}

	const token = request.headers.authorization.split(' ')[1];

	return jwt.verify(token, "i am a pilgrim and a stranger", (error, decoded) => {
		if (error) { return response.status(401).end(); }

		const userId = decoded.sub;

		return User.findById(userId, (userError, user) => {
			if (userError || !user) {
				return response.status(401).end();
			}

			return next();
		});
	});

};