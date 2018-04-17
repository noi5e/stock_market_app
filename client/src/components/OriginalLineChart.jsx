import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withFauxDOM } from 'react-faux-dom';
import * as d3 from 'd3';

const margin = { top: 20, right: 50, left: 50, bottom: 30 },
	outerHeight = 500,
	outerWidth = 1140,
	innerWidth = outerWidth - margin.left - margin.right,
	innerHeight = outerHeight - margin.top - margin.bottom;

class LineChart extends React.Component {
	constructor(props) {
		super(props);
		this.renderD3 = this.renderD3.bind(this);
		this.updateD3 = this.updateD3.bind(this);
	}

	componentDidMount() {
		this.renderD3();
	}

	componentDidUpdate(previousProps, previousState) {
		if (this.compareTwoArrays(this.props.stockData, previousProps.stockData) === false) {
			this.updateD3();
		}
	}

	render() {
		return (
			<div className="#line-chart-container">
				{this.props.chart}
			</div>
		);
	}

	compareTwoArrays(originalArray, newArray) {
		if (!newArray) {
			return false;
		}

		if (newArray.length !== originalArray.length) {
			return false;
		}

		for (var i = 0; i < newArray.length; i++) {
			if (newArray[i] !== originalArray[i]) {
				return false;
			}
		}

		return true;
	}

	renderChart() {
		
	}

	renderD3() {
		const stockData = this.props.stockData;

		const faux = this.props.connectFauxDOM('div', 'chart');

		let svg = d3.select(faux).append('svg')
			.attr('width', outerWidth)
			.attr('height', outerHeight)
			.attr('id', 'line-chart-svg');

		let g = svg.append('g')
			.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

		if (this.props.stockData.length > 0) {

			// chart rendering code

			var x = d3.scaleTime().rangeRound([0, innerWidth]),
				y = d3.scaleLinear().rangeRound([innerHeight, 0]);
			var line = d3.line()
				.curve(d3.curveBasis)
				.x(function(datum) { return x(datum['date']); })
				.y(function(datum) { return y(datum['value']); });

			var xMinimum = d3.min(this.props.stockData, function(stock) { return d3.min(stock['values'], function(datum) { return datum['date'] }); });
			var xMaximum = d3.max(this.props.stockData, function(stock) { return d3.max(stock['values'], function(datum) { return datum['date'] }); });
			var yMaximum = d3.max(this.props.stockData, function(stock) { return d3.max(stock['values'], function(datum) { return datum['value'] }); });

			x.domain([xMinimum, xMaximum]);
			y.domain([0, yMaximum]);

			const xTimeFormat = d3.timeFormat("%b %y")
			const formatXAxis = (time) => {
				return xTimeFormat(time).toUpperCase();
			};

			const formatYAxis = (value) => {
				return '$' + value
			};

			g.append('g')
				.attr('transform', 'translate(0, ' + innerHeight + ')')
				.call(d3.axisBottom(x).tickFormat(formatXAxis));

			g.append('g')
				.call(d3.axisLeft(y).tickFormat(formatYAxis));

			var stock = g.selectAll('.stock')
				.data(this.props.stockData)
				.enter()
				.append('g')
				.attr('class', 'stock');

			stock.append('path')
				.attr('class', 'line')
				.attr('d', function(stock) { return line(stock['values']); })
				.style('stroke', function(stock) { return stock['color']; });

		} else {

			g.append('text')
			.attr('x', innerWidth / 2)
			.attr('y', innerHeight / 2)
			.attr('text-anchor', 'middle')
			.attr('id', 'chart');

			g.select('#chart')
				.text('No stock ticker symbols have been entered.')

		}

	}

	updateD3() {
		const stockData = this.props.stockData;

		const faux = this.props.connectFauxDOM('div', 'chart');

		d3.select('g').remove();

		let g = d3.select('svg').append('g')
			.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

		if (this.props.stockData.length > 0) {

			var x = d3.scaleTime().rangeRound([0, innerWidth]),
				y = d3.scaleLinear().rangeRound([innerHeight, 0]);
			var line = d3.line()
				.curve(d3.curveBasis)
				.x(function(datum) { return x(datum['date']); })
				.y(function(datum) { return y(datum['value']); });

			var xMinimum = d3.min(this.props.stockData, function(stock) { return d3.min(stock['values'], function(datum) { return datum['date'] }); });
			var xMaximum = d3.max(this.props.stockData, function(stock) { return d3.max(stock['values'], function(datum) { return datum['date'] }); });
			var yMaximum = d3.max(this.props.stockData, function(stock) { return d3.max(stock['values'], function(datum) { return datum['value'] }); });

			x.domain([xMinimum, xMaximum]);
			y.domain([0, yMaximum]);

			const xTimeFormat = d3.timeFormat("%b %y")
			const formatXAxis = (time) => {
				return xTimeFormat(time).toUpperCase();
			};

			const formatYAxis = (value) => {
				return '$' + value
			};

			g.append('g')
				.attr('transform', 'translate(0, ' + innerHeight + ')')
				.call(d3.axisBottom(x).tickFormat(formatXAxis));

			g.append('g')
				.call(d3.axisLeft(y).tickFormat(formatYAxis));

			var stock = g.selectAll('.stock')
				.data(this.props.stockData)
				.enter()
				.append('g')
				.attr('class', 'stock');

			stock.append('path')
				.attr('class', 'line')
				.attr('d', function(stock) { return line(stock['values']); })
				.style('stroke', function(stock) { return stock['color']; });

		} else {

			// text placeholder: "No stock ticker symbols have been entered."

		}
	} 
}

LineChart.defaultProps = {
	chart: React.createElement(
		"svg",
		{ width: "960", height: "500", id: "line-chart-svg" },
		React.createElement(
			"text",
			{ x: "50%", y: "50%", textAnchor: "middle", id: 'chart' },
			"Loading..."
		)
	),
	stockData: []
}

LineChart.propTypes = {
	stockData: PropTypes.array.isRequired
}

const FauxLineChart = withFauxDOM(LineChart);

export default FauxLineChart;