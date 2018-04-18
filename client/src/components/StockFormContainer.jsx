import React from 'react';
import LineChart from './LineChart.jsx';
import StockForm from './StockForm.jsx';
import Stock from './Stock.jsx';

class StockFormContainer extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			searchTerm: '',
			stockData: [],
			isLoaded: false
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		// https://stackoverflow.com/questions/38122068/how-react-js-acts-as-a-websocket-client
		// https://www.npmjs.com/package/react-websocket
		// https://github.com/rajiff/ws-react-demo/blob/master/public/components/WebSocketClient.jsx

		this.socket = new WebSocket('wss://' + window.location.host);

		this.socket.addEventListener('open', (e) => {
			this.socket.send('New client opened up a socket!', (error) => {
				console.log('Error: ' + error);
			});
		});

		this.socket.addEventListener('message', (e) => {
			console.log('Message: ' + e.data);
		});

		const xhr = new XMLHttpRequest();
		xhr.open('post', '/api/get_master_state');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		xhr.addEventListener('load', () => {
			if (xhr.status === 200) {
				console.log('response from /api/get_master_state:');
				console.log(JSON.parse(xhr.response));

				this.setState({ 
					stockData: JSON.parse(xhr.response).sort((a, b) => { return a.name > b.name; }),
					isLoaded: true
				});
			} else {
				console.log('Error contacting API: ' + xhr.response);
			}
		});

		xhr.send();
	}

	componentWillUnmount() {
		if (!this.socket) { return; };

		try { 
			this.socket.close() 
		} catch (error) {
			console.log('Error closing socket: ' + error);
		}
	}

	handleChange(event) {
		this.setState({
			searchTerm: event.target.value
		});
	}

	handleRemove(event) {
		event.preventDefault();

		console.log(event.target.id)
	}

	handleSubmit(event) {
		event.preventDefault();

		const searchTerm = encodeURIComponent(this.state.searchTerm);

		let foundStockTicker = false;

		for (var i = 0; i < this.state.stockData.length; i++) {
			if (this.state.stockData[i].name === searchTerm) {
				foundStockTicker = true;
			}
		}

		if (foundStockTicker) {
			// add sequence for user entering duplicate stock ticker.

			console.log("stock ticker duplicate.");
		} else {
			const stockTicker = `stockTicker=${searchTerm}`;

			const xhr = new XMLHttpRequest();
			xhr.open('post', '/api/submit_stock_ticker');
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

			xhr.addEventListener('load', () => {
				if (xhr.status === 200) {
					const response = JSON.parse(xhr.response); 

					if (response.hasOwnProperty("quandl_error")) {
						// add sequence for stock ticker not found.

						console.log("no such stock ticker.")
					} else {
						// parses the response from API, adds it to state's list of stocks, then sorts state's list in alphabetical order
						this.setState({ stockData: [...this.state.stockData, response].sort((a, b) => { return a.name > b.name; }) });
					}
				} else {
					console.log('error from /api/submit_stock_ticker: ' + xhr.response);
				}
			});

			xhr.send(stockTicker);

		}
	}

	render() {
		let stockContent = [];

		if (!this.state.isLoaded) {

			return ( <div className='#line-chart-container'>
						  <svg width='960px' height='500px' id='line-chart-svg'>
						  	  <text x='50%' y='50%' textAnchor='middle' id='chart'>
						  	  	    Loading...
						  	  </text>
						  </svg>
						  <StockForm onSubmit={(e) => this.handleSubmit(e)} onChange={(e) => this.handleChange(e)} searchTerm={this.state.searchTerm} />
					 </div> );
			
		} else {

			if (this.state.stockData.length > 0) {

				for (var i = 0; i < this.state.stockData.length; i++) {
					const stockName = this.state.stockData[i].name;

					stockContent.push(<Stock key={stockName} id={stockName} color={this.state.stockData[i].color} onClick={(e) => this.handleRemove(e)} />);
				}
			}

			return (
				<div>
					<LineChart stockData={this.state.stockData} />
					<StockForm onSubmit={(e) => this.handleSubmit(e)} onChange={(e) => this.handleChange(e)} searchTerm={this.state.searchTerm} />
					{stockContent}
				</div>
			);

		}
	}
}

export default StockFormContainer;