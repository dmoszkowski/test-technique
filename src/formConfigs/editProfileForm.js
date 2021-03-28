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
			accept: "image/x-png,image/gif,image/jpeg",
		},
		{
			name: "newsletter",
			label: "Subscribe to newsletter",
			type: "checkbox",
		}
	]
});
