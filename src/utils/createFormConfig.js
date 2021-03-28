const createFieldValidateFunction = fieldConfig => ((value, allValues = {}) => {
	const valIsString = (typeof(value) === "string");
	const cleanValue = valIsString ? value.trim() : value;
	if (!cleanValue) {
		if (fieldConfig.required) {
			return({
				error:true,
				errType:"required",
				message: fieldConfig.requiredMessage || "This field is required."
			});
		} else {
			return({});
		}
	} else {
		let newValidity = {valid: true};
		if (fieldConfig.validation) {
			let isValid = true;
			switch(fieldConfig.validation.type) {
				case "confirm":
					if (value !== allValues[fieldConfig.validation.confirm]) {
						isValid = false;
					}
					break;
				case "regExp":
					if (!value.match(fieldConfig.validation.regExp)) {
						isValid = false;
					}
					break;
			}
			if (!isValid) {
				newValidity = {
					error:true,
					errType:"validation",
					message:fieldConfig.validation.error
				};
			}
		}
		return(newValidity);
	}
});


export default formConfig => {
	formConfig.fieldsByName = {};
	formConfig.fileInputs = [];
	formConfig.fields.forEach(fieldConfig => {
		if (!fieldConfig.validateFunction) {
			fieldConfig.validateFunction = createFieldValidateFunction(fieldConfig);
		}
		if (fieldConfig.type === "file") {
			formConfig.hasFileInputs = true;
			formConfig.fileInputs.push({
				name: fieldConfig.name,
				maxCount: fieldConfig.maxFileCount || 1
			});
		}
	});
	formConfig.validateForm = valuesObj => {
		for (let f = 0; f < formConfig.fields.length; f++) {
			const fieldConfig = formConfig.fields[f];
			const value = valuesObj[fieldConfig.name];
			const validationResult = fieldConfig.validateFunction(value, valuesObj);
			if (validationResult.error) {
				return false;
			}
		}
		return true;
	}
	return formConfig;
}
