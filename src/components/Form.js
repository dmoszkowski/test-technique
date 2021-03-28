import React, { useState, useRef } from 'react';
import FormField from './FormField';
import PropTypes from 'prop-types';
import useSSRVar from '/src/hooks/useSSRVar';

function Form({config, action = "", method="post", initialValues={}, onCancel}) {
	const [triggerValidation,setTriggerValidation] = useState(false);
	const formErrorMessage = useSSRVar('formError');
	const formValues = useRef({});
	const handleSubmit = event => {
		setTriggerValidation(!triggerValidation);
		if (!config.validateForm(formValues.current)) {
			event.stopPropagation();
			event.preventDefault();
		}
	}
	let formProps = {
		action,
		method,
		onSubmit: event=>handleSubmit(event),
	};
	if (config.hasFileInputs) {
		formProps.encType = "multipart/form-data";
	}
	return (
		<form {...formProps}>
			{
				formErrorMessage &&
				<p className="help is-danger">{formErrorMessage}</p>
			}
			{config.fields.map(field=>(
				<FormField
					key={field.name}
					config={field}
					triggerValidation={triggerValidation}
					handleChange={value=>{formValues.current[field.name] = value;}}
					formValuesRef={formValues}
					initialValue={initialValues[field.name]}
				/>
			))}
			<div className="field is-grouped">
				<div className="control">
					<button type="submit" className="button is-link">Submit</button>
				</div>
				{
					onCancel &&
					<div className="control">
						<button type="button" className="button is-link is-light" onClick={()=>onCancel()}>Cancel</button>
					</div>
				}
			</div>
		</form>
	);
}

Form.propTypes = {
	config: PropTypes.object.isRequired,
	action: PropTypes.string,
	method: PropTypes.string,
	onCancel: PropTypes.func,
	initialValues: PropTypes.object
};

export default Form;
