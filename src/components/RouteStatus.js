import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

function RouteStatus({ code, children }) {
	return (
		<Route
			render={({ staticContext }) => {
				if (staticContext) {
					staticContext.status = code;
				}
				return children;
			}}
		/>
	);
}

RouteStatus.propTypes = {
	code: PropTypes.number.isRequired,
	children: PropTypes.node
};

export default RouteStatus;
