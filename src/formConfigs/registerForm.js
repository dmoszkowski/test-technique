import createFormConfig from '/src/utils/createFormConfig';

export default createFormConfig({
	fields: [
		{
			name: "firstName",
			label: "First Name",
			icon: "user",
			required: true,
		},
		{
			name: "lastName",
			label: "Last Name",
		},
		{
			name: "email",
			label: "Email",
			icon: "envelope",
			type: "email",
			required: true,
			validation: {
				type: "regExp",
				regExp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
				error: "Please enter a valid email address",
			},
		},
		{
			name: "password",
			label: "Password",
			icon: "lock",
			type: "password",
			required: true,
			validation: {
				type: "regExp",
				regExp: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/,
				error: "Your password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter and one number",
			},
		},
		{
			name: "confirmPassword",
			label: "Password confirmation",
			icon: "lock",
			type: "password",
			required: true,
			validation: {
				type: "confirm",
				confirm: "password",
				error: "Incorrect password confirmation",
			},
		},
		{
			name: "status",
			label: "Status",
			placeholder: "Please select your status",
			type: "select",
			choices: [
				"Teacher",
				"Teacher assistant",
				"Student",
			],
		},
		{
			name: "picture",
			label: "Picture",
			type: "file",
			accept: "image/png,image/gif,image/jpeg",
			required: true,
		},
		{
			name: "newsletter",
			label: "Subscribe to newsletter",
			type: "checkbox",
		},
		{
			name: "termsAndConditions",
			label: "I have read terms and conditions",
			requiredMessage: "You must accept the terms and conditions",
			type: "checkbox",
			required: true,
		},
	]
});
