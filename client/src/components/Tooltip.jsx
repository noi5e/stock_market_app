import React from 'react';
import PropTypes from 'prop-types';

class Tooltip extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		let objectIsEmpty = true;
		
		for (var key in this.props.tooltipData) {
			if (this.props.tooltipData.hasOwnProperty(key)) {
				objectIsEmpty = false;
			}
		}
		
		if (objectIsEmpty) {
			return null;
		} else {
			const divStyle = {
				opacity: 0.9,
				position: 'absolute',
				left: this.props.tooltipData.pageX + 10 + 'px',
				top: this.props.tooltipData.pageY - 30 + 'px'
			}
			
			return <div id='tooltip' style={divStyle}>
			               {this.props.tooltipData.date}<br />
			               {this.props.tooltipData.value}
		       	       </div>;	
		}
	}
}

Tooltip.propTypes = {
	tooltipData: PropTypes.object.isRequired
}

export default Tooltip;
