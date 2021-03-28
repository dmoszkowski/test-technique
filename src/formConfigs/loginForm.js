import createFormConfig from '/src/utils/createFormConfig';

export default createFormConfig({
	fields: [
		{
			name: "email",
			label: "Email",
			icon: "envelope",
			type: "email",
			required: true
		},
		{
			name: "password",
			label: "Password",
			icon: "lock",
			type: "password",
			required: true
		}
	]
});
