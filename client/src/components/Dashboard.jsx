import React from 'react';
import Auth from '../../modules/Auth.js';
import PropTypes from 'prop-types';

class Dashboard extends React.Component {
	render() {
		return (<div>{this.props.secretMessage}</div>);
	}
}

Dashboard.propTypes = {
	secretMessage: PropTypes.string.isRequired
};

export default Dashboard;