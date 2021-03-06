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
				position: 'absolute',
				left: this.props.tooltipData.pageX + 10 + 'px',
				top: this.props.tooltipData.pageY - 30 + 'px',
				fontWeight: 'bold'
			}
			
			const spanStyle = {
				color: this.props.tooltipData.color
			}
			
			const date = new Date(this.props.tooltipData.date);
			const dateString = date.getMonth() + 1 + '/' + date.getDate();
			
			return <div id='tooltip' style={divStyle}>
				       <span style={spanStyle} className='tooltip-row'>{this.props.tooltipData.name}</span><br />
			               <span className='tooltip-row'>{dateString + ' - ' + '$' + this.props.tooltipData.value}</span><br />
		       	       </div>;	
		}
	}
}

Tooltip.propTypes = {
	tooltipData: PropTypes.object.isRequired
}

export default Tooltip;
