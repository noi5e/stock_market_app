const express = require('express');
var router = new express.Router();

const https = require('https');
const querystring = require('querystring');
const randomColor = require('randomcolor');

// import the websocket object from index.js in order to send broadcast messages.
const wsInstance = require('../../index.js');

var State = require('../models/state');

const quandlApiKey = encodeURIComponent(process.env.QUANDL_API_KEY);

// formatter function which adds '0' to date object's year, eg. '5' => '05'
function formatUTCMonth(monthString) {
	return (monthString.length === 1) ? '0' + (parseInt(monthString) + 1).toString() : monthString;
}

router.post('/remove_stock_ticker', function(request, response, next) {

	// look up stock ticker in the master state data
	State.findOne({ name: 'original' }, (error, document) => {
		if (error) { console.log('couldn\'t find mongo document named "original": ' + error); }

		for (var i = 0; i < document.stockList.length; i ++) {
			if (document.stockList[i].name === request.body.stockTicker) {

				// if the stock ticker is found, remove it from the master state data
				document.stockList.splice(i, 1);

				// broadcast the new master state data to each of the web socket clients
				const broadcastData = document.stockList.map(function(datum) {
					return {
						color: datum.color,
						name: datum.name,
						values: datum.values
					};
				});

				wsInstance.webSocketServer.clients.forEach(function(client) {
					client.send('newState:' + JSON.stringify(broadcastData));		
				});

				document.save();

				response.send(broadcastData);
			}
		}
	});
});

router.post('/submit_stock_ticker', function(request, response, next) {

	// make start and end date ranges for quandl request
	const currentTime = new Date();
	const endYear = currentTime.getUTCFullYear();
	const startYear = endYear - 1;
	const endDateString = endYear + '-' + formatUTCMonth(currentTime.getUTCMonth().toString()) + '-' + currentTime.getUTCDate();
	const startDateString = startYear + '-' + formatUTCMonth(currentTime.getUTCMonth().toString()) + '-' + currentTime.getUTCDate();

	let path = '/api/v3/datasets/WIKI/';
	path += request.body.stockTicker;
	path += '.json?'
	path += 'api_key=' + quandlApiKey + '&';
	path += 'column_index=4&';
	path += 'start_date=' + startDateString + '&';
	path += 'end_date=' + endDateString + '&';
	// path += 'start_date=2017-03-14&';
	// path += 'end_date=2018-03-14&';
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

				// make new stock object including stock ticker name, ticker values and color
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

				// push the new data into master state, and broadcast to websocket instances
				State.findOne({ name: 'original' }, function(error, document) {

					document.stockList.push(finishedData);

					const broadcastData = document.stockList.map(function(datum) {
						return {
							color: datum.color,
							name: datum.name,
							values: datum.values
						};
					});

					wsInstance.webSocketServer.clients.forEach(function(client) {
						client.send('newState:' + JSON.stringify(broadcastData));		
					});

					document.save();

					response.send(broadcastData);
				});
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
