import mongoose from 'mongoose';
import bcrypt from "bcrypt";
const saltRounds = 10;

const userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		index: true,
		unique: true,
	},
	password: String,
	status: String,
	picture: {
		fileName: String,
		mimeType: String,
		data: Buffer,
	},
	newsletter: {
		type: Boolean,
		index: true,
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

userSchema.pre('save', function(next) {
	if (!this.isModified('password')) return next();
	if (this.password === "") return next();
	bcrypt.hash(this.password, saltRounds).then(hash=>{
		this.password = hash;
		next();
	});
});

userSchema.methods.comparePassword = function(candidatePassword) {
	if (this.password === "") {
		return Promise.resolve(false);
	}
	return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
