import User from './model/User.mjs';

const extractUserData = (user, selectedFields) => {
	const ret = {};
	if (user._id) {
		ret.id = user._id.toString();
		ret.picture = `/userPicture/${ret.id}`;
	}
	selectedFields.split(' ').forEach(f=>{ret[f] = user[f]});
	return ret;
}

export default {
	usersList: async () => {
		const selectedFields = 'firstName lastName status';
		const requestResult = await User.find({},`_id ${selectedFields}`);
		return requestResult.map(oneUser => extractUserData(oneUser,selectedFields));
	},
	userDetails: async (req,userId) => {
		try {
			let selectedFields = 'firstName lastName status email';
			const isCurrentUser = !!(req.user && (req.user === userId));
			if (isCurrentUser) {
				selectedFields += ' newsletter';
			}
			const user = await User.findById(userId,`_id ${selectedFields}`);
			if (user) {
				const ret = extractUserData(user,selectedFields);
				ret.isCurrentUser = isCurrentUser;
				return ret;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}
};
