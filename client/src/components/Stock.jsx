import React from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';

class Stock extends React.Component {

	render() {
		return (
			<Button className='remove-button' id={this.props.id} onClick={this.props.onClick} style={{ backgroundColor: this.props.color, color: 'white' }}>
				<Glyphicon glyph="remove" id={this.props.id} /> {this.props.id}
			</Button>
		);
	}
}

Stock.propTypes = {
	id: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired
}

export default Stock;