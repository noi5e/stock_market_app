import React from 'react';
import LineChart from './LineChart.jsx';
import StockForm from './StockForm.jsx';
import Stock from './Stock.jsx';
import Tooltip from './Tooltip.jsx';

class StockFormContainer extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			searchTerm: '',
			stockData: [],
			tooltipData: {},
			isLoaded: false
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleMouseOut = this.handleMouseOut.bind(this);
		this.getMouseOverData = this.getMouseOverData.bind(this);
	}

	// helper function: component receives master state data via two methods: http response and websocket broadcast message. this function compares the two and only updates state if the new state has different data.
	compareOldStateWithNewState(oldState, newState) {
		const alphabeticNewState = newState.sort((a, b) => { return a.name > b.name; });
		
		let statesAreSame = true;

		if (!alphabeticNewState) {
			statesAreSame = false;
		}

		if (alphabeticNewState.length !== oldState.length) {
			statesAreSame = false;
		}

		for (var i = 0; i < alphabeticNewState.length; i++) {
			if (alphabeticNewState[i] !== oldState[i]) {
				statesAreSame = false;
			}
		}

		if (!statesAreSame) {
			return alphabeticNewState.sort((a, b) => { return a.name > b.name; });
		} else {
			return oldState;
		}
	}

	componentDidMount() {
		this.socket = new WebSocket('wss://' + window.location.host);

		this.socket.addEventListener('open', (e) => {
			this.socket.send('New client opened up a socket!', (error) => {
				console.log('Error sending websocket message to server: ' + error);
			});
		});

		this.socket.addEventListener('message', (e) => {
			let message = e.data;
			let newStateRegex = /^newState\:/;

			// examines broadcast message. if it begins with 'newState,' updates state.
			if (newStateRegex.test(message)) {
				message = message.replace(newStateRegex, '');
				let messageData = JSON.parse(message);
				
				this.setState({
					stockData: this.compareOldStateWithNewState(this.state.stockData, messageData)
				});
			}
		});

		const xhr = new XMLHttpRequest();
		xhr.open('post', '/api/get_master_state');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		xhr.addEventListener('load', () => {
			if (xhr.status === 200) {
				this.setState({ 
					stockData: this.compareOldStateWithNewState(this.state.stockData, JSON.parse(xhr.response)),
					isLoaded: true
				});
			} else {
				console.log('Error contacting app API: ' + xhr.response);
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

	getMouseOverData(eventData) {
		this.setState({
			tooltipData: eventData
		});
	}

	handleMouseOut() {
		this.setState({
			tooltipData: {}	
		});
	}
	
	handleChange(event) {
		this.setState({
			searchTerm: event.target.value
		});
	}

	handleRemove(event) {
		event.preventDefault();

		const stockTicker = `stockTicker=${event.target.id}`;

		const xhr = new XMLHttpRequest();
		xhr.open('post', '/api/remove_stock_ticker');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		xhr.addEventListener('load', () => {
			if (xhr.status === 200) {
				this.setState({
					stockData: this.compareOldStateWithNewState(this.state.stockData, JSON.parse(xhr.response))
				});
			} else {
				console.log('error from /api/remove_stock_ticker: ' + xhr.response);
			}
		});

		xhr.send(stockTicker);
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
			console.log("error: stock ticker duplicate.");
		} else {
			const stockTicker = `stockTicker=${searchTerm}`;

			const xhr = new XMLHttpRequest();
			xhr.open('post', '/api/submit_stock_ticker');
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

			xhr.addEventListener('load', () => {
				if (xhr.status === 200) {
					const response = JSON.parse(xhr.response); 

					if (response.hasOwnProperty("quandl_error")) {
						console.log("error: no such stock ticker.")
					} else {
						// parses the response from API, adds it to state's list of stocks, then sorts state's list in alphabetical order
						this.setState({
							searchTerm: '',
							stockData: this.compareOldStateWithNewState(this.state.stockData, response)
						});
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

		// load transitional "Loading" svg if the component hasn't yet received props
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
					<LineChart stockData={this.state.stockData} getMouseOverData={(d) => this.getMouseOverData(d)} handleMouseOut={this.handleMouseOut} />
					<StockForm onSubmit={(e) => this.handleSubmit(e)} onChange={(e) => this.handleChange(e)} searchTerm={this.state.searchTerm} />
					{stockContent}
					<Tooltip tooltipData={this.state.tooltipData} />
				</div>
			);

		}
	}
}

export default StockFormContainer;
