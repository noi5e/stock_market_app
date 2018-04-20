const express = require('express');
var router = new express.Router();

const https = require('https');
const querystring = require('querystring');
const randomColor = require('randomcolor');

var webSocket = require('../../index.js');

var State = require('../models/state');

// const quandlApiKey = encodeURIComponent(process.env.QUANDL_API_KEY);
const quandlApiKey = 'HMMzS9xpbSgZhs3z2zjv';

router.post('/remove_stock_ticker', function(request, response, next) {
	webSocket.sendMessage('This is a message from api.js', function(error) {
		if (error) { console.log('error from api.js: ' + error); }
	});
	
	response.send([]);
});

router.post('/submit_stock_ticker', function(request, response, next) {

	let path = '/api/v3/datasets/WIKI/';
	path += request.body.stockTicker;
	path += '.json?'
	path += 'api_key=' + quandlApiKey + '&';
	path += 'column_index=4&';
	path += 'start_date=2017-03-14&';
	path += 'end_date=2018-03-14&';
	path += 'order=asc&';
	path += 'collapse=weekly';

	const options = {
		method: 'GET',
		hostname: 'www.quandl.com',
		path: path,
	}

	const stockRequest = https.request(options, (stockResponse) => {
		let chunks = '';

		stockResponse.on('data', (chunk) => {
			chunks += chunk;
		});

		stockResponse.on('end', () => {
			const parsedData = JSON.parse(chunks);

			if (parsedData.hasOwnProperty('quandl_error')) {
				response.json(parsedData);
			} else {

				const finishedData = {
					name: parsedData.dataset.dataset_code,
					values: parsedData.dataset.data.map(function(datum) {
						return {
							date: new Date(datum[0]).getTime(),
							value: datum[1]
						}
					}),
					color: randomColor({
						seed: parsedData.dataset.dataset_code
					})
				}

				State.findOne({ name: 'original' }, function(error, document) {
					document.stockList.push(finishedData);
					document.save();
				});

				response.json(finishedData);
			}
		});
	});

	stockRequest.end();
});

router.post('/get_master_state', function(request, response, next) {
	State.findOne({ name: 'original' }, (error, document) => {
		response.send(document.stockList);
	});
});

module.exports = router;
