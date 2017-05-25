var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: './src',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?/,
				query: { presets: ['react', 'es2015'] },
				loader: 'babel-loader',
				include: __dirname + '/src'
			},
			{
				test: /\.css/,
				loader: ExtractTextPlugin.extract("css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]")
				// loaders: ['style-loader', 'css-loader'],
				// include: __dirname + '/src'
			},
			{
				test: /\.(svg|woff|woff2|eot|ttf|otf)$/,
				loader: 'file-loader'			
			}
		]
	},
	plugins: [
		new ExtractTextPlugin("styles.css")
	]
};