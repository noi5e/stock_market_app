import React from 'react';
import ReactDOM from 'react-dom';
import StockFormContainer from './components/StockFormContainer.jsx'

class App extends React.Component {
	render() {
		return (
			<div>
				<div className="container">
					<div className="header clearfix">
						<h3 className="text-muted">FreeCodeCamp Stock Market App</h3>
					</div>
				</div>

				<div className="container">
					<StockFormContainer />
					<footer className="footer">
						<p>&copy; 2018 Will G</p>
					</footer>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	(<App />), document.getElementById('root'));