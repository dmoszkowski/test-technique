import React from 'react';
import Form from '/src/components/Form';
import loginFormConfig from '/src/formConfigs/loginForm';

function Login() {
	return (
		<div className="container">
			<div className="section has-text-centered">
				<h1 className="title">Log in to your account</h1>
			</div>
			<div className="box">
				<Form config={loginFormConfig} />
			</div>
			<div className="section">
			</div>
		</div>
	);
}

export default Login;
