import React from 'react';
import PropTypes from 'prop-types';

class Tooltip extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return <div id='tooltip'>
		       </div>;
	}
}

Tooltip.propTypes = {
	tooltipData: PropTypes.object.isRequired
}

export default Tooltip;
