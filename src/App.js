import './App.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import SSRVarsContainerContext from '/src/contexts/SSRVarsContainerContext';

import NavBar from '/src/components/NavBar';
import RouteStatus from '/src/components/RouteStatus.js';
import Home from '/src/components/pages/Home';
import Register from '/src/components/pages/Register';
import Login from '/src/components/pages/Login';
import User from '/src/components/pages/User';
import NotFound from '/src/components/pages/NotFound';

const defaultSSRVarsContainer = (
	(
		(typeof(window) !== "undefined")
		&& (typeof(window._SSRVars) === "object")
		&& window._SSRVars
	) || {}
);

const App = ({ssrVarsContainer = defaultSSRVarsContainer}) => {

	return (
		<SSRVarsContainerContext.Provider value={ssrVarsContainer}>
			<NavBar />
			<Switch>
				<Route exact path="/">
					<Home />
				</Route>
				<Route exact path="/register">
					<Register />
				</Route>
				<Route exact path="/login">
					<Login />
				</Route>
				<Route exact path="/users/:id">
					<User />
				</Route>
				<Route path="*">
					<RouteStatus code={404}>
						<NotFound />
					</RouteStatus>
				</Route>
			</Switch>
		</SSRVarsContainerContext.Provider>
	);
};


App.propTypes = {
	ssrVarsContainer: PropTypes.object,
};

export default App;
