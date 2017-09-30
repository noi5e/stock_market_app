import React from 'react';
import Auth from '../../modules/Auth.js';
import Dashboard from './Dashboard.jsx';

class DashboardContainer extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			secretMessage: ''
		};
	}

	componentDidMount() {
		const xhr = new XMLHttpRequest();
		xhr.open('get', '/api/dashboard');
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
		xhr.responseType = 'json';
		xhr.addEventListener('load', () => {
			if (xhr.status === 200) {
				this.setState({
					secretMessage: xhr.response.message
				});
			}
		});

		xhr.send();
	}

	render() {
		return (
			<Dashboard secretMessage={this.state.secretMessage} />
		);
	}
}

export default DashboardContainer;