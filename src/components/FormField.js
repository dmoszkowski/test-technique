import React, { useRef, useEffect } from 'react';
import useFieldConfig from '/src/hooks/useFieldConfig';
import useSSRVar from '/src/hooks/useSSRVar';
import PropTypes from 'prop-types';
import clsx from 'clsx';


function FormField({config, triggerValidation, formValuesRef, handleChange = ()=>{}, initialValue}) {
	let initialVal = useSSRVar(`form/${config.name}/initialValue`, initialValue, true);
	if (config.type === 'file') {
		initialVal = undefined;
	}
	const serverValidationError = useSSRVar(`form/${config.name}/serverValidationError`);
	const triggerVal = (triggerValidation == !!useSSRVar(`form/${config.name}/forceValidateOnLoad`));
	const {bind, validity, value} = useFieldConfig(config, formValuesRef, triggerVal, initialVal, serverValidationError);
	useEffect(()=>{
		handleChange(value);
	},[handleChange,value]);
	const inputEl = useRef(null);
	const validityClass = clsx(validity.valid && "is-success",validity.error && "is-danger");
	const inputProps = {
		name: config.name,
		ref: inputEl,
		...bind
	};
	const placeholder = config.placeholder || config.label;
	let displayIcons = false;
	let displayLabel = true;
	const inputPart = (() => {
		switch(config.type) {
			case "checkbox":
				displayLabel = false;
				return (
					<label className="checkbox">
						<input type="checkbox" {...inputProps} />
						&nbsp;{config.label}
					</label>
				);
			case "select":
				return (
					<div className={clsx("select is-fullwidth",validityClass)}>
						<select className={clsx((!value) && "has-text-grey-lighter")} {...inputProps}>
							<option value="" disabled>{placeholder}</option>
							{config.choices.map(oneVal=>(
								<option key={oneVal} value={oneVal}>{oneVal}</option>
							))}
						</select>
					</div>
				);
			case "file":
				return (
					<div className={clsx("file has-name is-fullwidth",validityClass)}>
						<label className="file-label">
							<input className="file-input" type="file" {...inputProps} accept={config.accept} />
							<span className="file-cta">
								<span className="file-icon">
									<i className="fas fa-upload"></i>
								</span>
								<span className="file-label">
									Choose a file…
								</span>
							</span>
							<span className="file-name">
								{
									inputEl.current && inputEl.current.files && inputEl.current.files[0] ?
										inputEl.current.files[0].name
									:
										<span className="has-text-grey-lighter">
											{placeholder}
										</span>
								}
							</span>
						</label>
					</div>
				);
			default:
				displayIcons = true;
				return (
					<input
						className={clsx("input",validityClass)}
						type={config.type || "text"}
						placeholder={placeholder}
						{...inputProps}
					/>
				);
		}
	})();

	const configIcon = displayIcons && config.icon;
	const validityIcon = displayIcons && (validity.valid || validity.error);

	return (
		<div className="field">
			{displayLabel && (
				<label className="label">
					{config.label}
					{config.required && (
						<span className="has-text-danger">
							&nbsp;*
						</span>
					)}
				</label>
			)}

			<div className={clsx("control", configIcon && "has-icons-left", validityIcon && "has-icons-right")}>
				{inputPart}
				{configIcon && (
					<span className="icon is-small is-left">
						<i className={clsx("fas",`fa-${configIcon}`)}></i>
					</span>
				)}
				{validityIcon && validity.valid && (
					<span className="icon is-small is-right has-text-success">
						<i className="fas fa-check"></i>
					</span>
				)}
				{validityIcon && validity.error && (
					<span className="icon is-small is-right has-text-danger">
						<i className="fas fa-exclamation-triangle"></i>
					</span>
				)}
			</div>
			<p className="help is-danger">
				{validity.message && validity.message}
			</p>
		</div>
	)
}

FormField.propTypes = {
	config: PropTypes.object.isRequired,
	triggerValidation: PropTypes.bool,
	handleChange: PropTypes.func,
	formValuesRef: PropTypes.shape({ current: PropTypes.object.isRequired }),
	initialValue: PropTypes.any
};

export default FormField;
