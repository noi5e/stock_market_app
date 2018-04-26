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
		this.renderOrUpdateChart = this.renderOrUpdateChart.bind(this);
	}

	componentDidMount() {
		this.renderOrUpdateChart();
	}

	componentDidUpdate(previousProps, previousState) {
		if (this.compareTwoArrays(this.props.stockData, previousProps.stockData) === false) {
			this.renderOrUpdateChart();
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

// 	getMouseOverData(data) {
// 		console.log(data);
// 	}

	renderOrUpdateChart() {
		// create a tooltip in react-faux-dom: https://github.com/Olical/react-faux-dom/issues/31

		const stockData = this.props.stockData;

		var self = this;

		const faux = this.props.connectFauxDOM('div', 'chart');

		if (d3.select('g').empty()) {

			var svg = d3.select(faux).append('svg')
				.attr('width', outerWidth)
				.attr('height', outerHeight)
				.attr('id', 'line-chart-svg');

			var tooltip = svg.append('div')
				.attr('class', 'tooltip')
				.style('opacity', 0);
			
			var g = svg.append('g')
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

		} else {

			d3.select('g').remove();

			var g = d3.select('svg').append('g')
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

		}

		if (this.props.stockData.length > 0) {

			var circleData = [];
			
			for (var i = 0; i < this.props.stockData.length; i++) {
				for (var j = 0; j < this.props.stockData[i].values.length; j++) {
					circleData.push({
						date: this.props.stockData[i].values[j].date,
						value: this.props.stockData[i].values[j].value,
						color: this.props.stockData[i].color
					});
				}
			}
			
			var x = d3.scaleTime().rangeRound([0, innerWidth]),
				y = d3.scaleLinear().rangeRound([innerHeight, 0]);
			var line = d3.line()
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

				
			g.selectAll('.dot')
				.data(circleData)
				.enter()
				.append("circle")
				.attr("class", "dot")
				.attr("r", 3.5)
				.attr("cx", function(datum) { return x(datum['date']); })
				.attr("cy", function(datum) { return y(datum['value']); })
// 					.style("fill", function(stock) { return this.props.stockData[i].color; });
			
			g.selectAll('.line')
				.on('mousemove', function(datum) {
					console.log(datum);
					self.props.getMouseOverData({ pageX: d3.event.pageX, pageY: d3.event.pageY });
				})
				// .on('mouseout', function() {

				// });

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
