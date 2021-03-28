import React from 'react';
import Form from '/src/components/Form';
import registerFormConfig from '/src/formConfigs/registerForm';

function Register() {
	return (
		<div className="container">
			<div className="section has-text-centered">
				<h1 className="title">Create your account</h1>
			</div>
			<div className="box">
				<Form config={registerFormConfig} />
			</div>
			<div className="section">
			</div>
		</div>
	);
}

export default Register;
