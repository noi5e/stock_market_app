var express = require('express');
var router = new express.Router();

var https = require('https');
var querystring = require('querystring');

var randomColor = require('randomcolor');

var WebSocket = require('ws');

var State = require('../models/state');

// const quandlApiKey = encodeURIComponent(process.env.QUANDL_API_KEY);
var quandlApiKey = 'HMMzS9xpbSgZhs3z2zjv';

router.post('/remove_stock_ticker', function(request, response, next) {
	console.log(request.body.stockTicker);

	const webSocket = new WebSocket('wss://randomfoobar.com');

	webSocket.on('open', function() {
		console.log('api.js connected to websocket');
		webSocket.send(Date.now());
	});

	webSocket.on('close', function() {
		console.log('api.js disconnected from websocket');
	});

	webSocket.on('message', function(message) {
		console.log('message at api.js: ' + message);
	});

	response.json([]);
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