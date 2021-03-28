import { useState, useRef, useEffect } from 'react';

export default (config, formValuesRef = {current:{}}, triggerValidation = false, initialValue, serverValidationError) => {
	// 
	const valueProp = config.type === "checkbox" ? "checked" : "value";
	const untouched = useRef(true);
	const [value, setValue] = useState("");
	useEffect(()=>{
		setValue(initialValue || "");
	},[initialValue]);
	const [validity, setValidity] = useState({});
	const onChange = event => {
		const val = event.target[valueProp];
		setValue(val);
	}
	useEffect(()=>{
		if (untouched.current) {
			untouched.current = false;
		} else {
			let newValidity = config.validateFunction(value,formValuesRef.current);
			if (serverValidationError && (!newValidity.error)) {
				if (value === serverValidationError.value) {
					newValidity = {
						error: true,
						errType: "serverValidation",
						message: serverValidationError.message
					};
				}
			}
			setValidity(newValidity);

		}
	},[config,value,triggerValidation,formValuesRef,serverValidationError])
	let ret = {
		value,
		bind: {
			onChange
		},
		validity,
	};
	ret.bind[valueProp] = value;
	return ret;
};
