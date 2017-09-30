import React from 'react';
import DashboardContainer from './DashboardContainer.jsx';
import bootstrap from '../../../server/static/css/bootstrap.css'
import style from '../../../server/static/css/style.css'
import Auth from '../../modules/Auth.js';

class Home extends React.Component {
	render() {
		var userDashboard = 'You are not logged in.';

		if (Auth.isUserAuthenticated()) {
			userDashboard = <DashboardContainer />;
		}

		return (
			<div className={bootstrap['col-lg-12']}>
				<h2 className={bootstrap['page-header'] + ' ' + style['page-header']}>Home</h2>
				{userDashboard}
			</div>
		);
	}
}

export default Home;