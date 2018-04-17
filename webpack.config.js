var path = require('path');

module.exports = {
	entry: './client/src/app.jsx',
	output: {
		path: path.resolve(__dirname, 'client/dist/js'),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				query: { presets: ['es2015', 'react'] },
				loader: 'babel-loader',
				include: __dirname + '/client'
			}
		]
	}
};