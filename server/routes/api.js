const express = require('express');

const router = new express.Router();

router.get('/dashboard', (request, response) => {
	response.status(200).json({
		message: "You're authorized to see this secret message."
	});
});

module.exports = router;