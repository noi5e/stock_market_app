import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, Button, InputGroup, Glyphicon } from 'react-bootstrap';

class StockForm extends React.Component {
	render() {
		return (
			<form onSubmit={this.props.onSubmit}>
				<FormGroup controlId="searchTerm">
					<ControlLabel>Enter a stock ticker symbol to add it to the chart:</ControlLabel>
					<InputGroup>
						<FormControl type="text" value={this.props.searchTerm} onChange={this.props.onChange} />
						<InputGroup.Button>
							<Button type="submit"><Glyphicon glyph="search" /></Button>
						</InputGroup.Button>
					</InputGroup>
				</FormGroup>
			</form>
		);
	}
}

StockForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	searchTerm: PropTypes.string.isRequired
}

export default StockForm;