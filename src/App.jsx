import React from 'react';
import bootstrap from './css/bootstrap.css'
import style from './css/style.css'

export default class App extends React.Component {
	render() {
		return (
			<div className={bootstrap.container + ' ' + style.container}>
				<div className={bootstrap.header + ' ' + style.header + ' ' + bootstrap.clearfix}>
					<nav>
						<ul className={bootstrap.nav + ' ' + bootstrap['nav-pills'] + ' ' + bootstrap['pull-right']}>
							<li role='presentation'><a href='/'>Home</a></li>
							<li role='presentation'><a href='/'>Login</a></li>
							<li role='presentation'><a href='/'>Register</a></li>
						</ul>
					</nav>

					<h3 className={bootstrap['text-muted']}>FreeCodeCamp Nightlife App</h3>
				</div>

				<div>
					<div className={bootstrap.row}>
						<div className={bootstrap['col-lg-12']}>
						</div>

						<div className={bootstrap['col-lg-12']}>
							<h2 className={bootstrap['page-header'] + ' ' + style['page-header']}>Bars Near You</h2>
						</div>
					</div>
				</div>

				<footer className={bootstrap.footer + ' ' + style.footer}>
					<p>&copy; 2016 Will G</p>
				</footer>
			</div>
		);
	}
}