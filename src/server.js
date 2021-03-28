import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import multer from 'multer';
import registerFormConfig from '/src/formConfigs/registerForm';
import loginFormConfig from '/src/formConfigs/loginForm';
import editProfileFormConfig from '/src/formConfigs/editProfileForm';
import mongoose from 'mongoose';
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

import User from '/src/server/data/model/User.js';
import dataRequests from '/src/server/data/dataRequests.js';
import renderApp from '/src/server/renderApp';


mongoose.connect(process.env.RAZZLE_MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("MongoDB connection successful");
});

const upload = multer();

passport.use(new LocalStrategy({usernameField: 'email'},async(email, password, done) => {
	try {
		const user = await(User.findOne({ email },'_id email password'));
		if (!user) {
			return done(null, false, { message: 'Incorrect username.' });
		}
		if (!await(user.comparePassword(password))) {
			return done(null, false, { message: 'Incorrect password.' });
		}
		return done(null, user);
	} catch(err) {
		return done(err);
	}
}));

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id,'_id');
		if (!user) {
			return done(new Error('user not found'));
		}
		done(null, id);
	} catch (e) {
		done(e);
	}
});

const prepareFormData = (formConfig, req) => {
	const reqBody = req.body || {};
	const reqFiles = req.files || {};
	const formData = {};
	formConfig.fields.forEach(oneField=>{
		const fieldName = oneField.name;
		let valueForField = reqBody[fieldName];
		switch(oneField.type) {
			case "checkbox":
				valueForField = !!valueForField;
				break;
			case "file":
				valueForField = undefined;
				if (reqFiles[fieldName] && reqFiles[fieldName][0]) {
					const foundFile = reqFiles[fieldName][0];
					const mimeType = foundFile.mimetype;
					valueForField = {
						fileName: foundFile.originalname,
						mimeType,
						data: foundFile.buffer,
					}
					if (oneField.accept && (oneField.accept.split(',').indexOf(mimeType) < 0)) {
						valueForField = undefined;
					}
				}
				break;
		}
		formData[fieldName] = valueForField;
	});
	return(formData);
}

const server = express();

const preloadData = (dataRequest,param) => (async (req,res,next) => {
	const preloadedData = await dataRequests[dataRequest](req,param);
	const paramPart = (typeof(param) !== "undefined") ? `/${param}` : '';
	req.exportVar(`loadedData/${dataRequest}${paramPart}`,preloadedData);
	next();
});

const emailIsAvailable = async email => {
	const userWithSameEmail = await(User.findOne({email},'email'));
	return !userWithSameEmail;
}

server
	.disable('x-powered-by')
	.use(express.static(process.env.RAZZLE_PUBLIC_DIR))
	.use(session({
		secret: "jkxdvgklgf1256",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongoUrl: process.env.RAZZLE_MONGO_URI })
	}))
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(passport.initialize())
	.use(passport.session())
	.use((req, res, next)=>{
		req.locals = req.locals || {};
		req.locals.exportVars = req.locals.exportVars || {};
		req.exportVar = (varName,val) => {
			req.locals.exportVars[varName] = val;
		}
		next();
	})
	.get('/ajax/:dataRequest/:param?', async(req,res,next) => {
		if (req.params.dataRequest in dataRequests) {
			const reqResult = await dataRequests[req.params.dataRequest](req,req.params.param);
			res.json(reqResult);
		} else {
			next();
		}
	})
	.get('/userPicture/:id', async(req,res) => {
		try {
			let user = await User.findById(req.params.id,'picture');
			if (user && user.picture && user.picture.data) {
				res.setHeader('content-type', user.picture.mimeType);
				res.send(user.picture.data);
			} else {
				res.status(404).send();
			}
		} catch(err) {
			res.status(404).send();
		}
	})
	.get('/',preloadData('usersList'))
	.get('/users/:id',(req,res,next)=>{
		preloadData('userDetails',req.params.id)(req,res,next)
	})
	.post('/register', upload.fields(registerFormConfig.fileInputs), async (req,res,next) => {
		const formValues = prepareFormData(registerFormConfig,req);
		let formIsValid = registerFormConfig.validateForm(formValues);
		if (formIsValid) {
			const userEmail = formValues.email;
			if (!await(emailIsAvailable(userEmail))) {
				formIsValid = false;
				req.exportVar(`form/email/serverValidationError`, {
					value: userEmail,
					message: "Another user account already exists with this email"
				});
			}
		}
		if (formIsValid) {
			const newUser = new User(formValues);
			await newUser.save();
			req.login(newUser,err=>{
				if (err) {
					return next(err);
				} else {
					res.redirect(`/users/${newUser._id}`);
				}
			});
		} else {
			['password','confirmPassword','picture'].forEach(oneField => {
				if (formValues[oneField]) {
					delete(formValues[oneField]);
				}
			});
			for (let formField in formValues) {
				req.exportVar(`form/${formField}/initialValue`, formValues[formField]);
				req.exportVar(`form/${formField}/forceValidateOnLoad`, true);
			}
			next();
		}
	}, renderApp)
	.post('/editProfile', upload.fields(editProfileFormConfig.fileInputs), async (req,res,next) => {
		try {
			if (!req.user) {
				return res.redirect('/login');
			}
			const formValues = prepareFormData(editProfileFormConfig,req);
			let formIsValid = editProfileFormConfig.validateForm(formValues);
			if (formIsValid) {
				let user = await (User.findById(req.user));
				if (!user) {
					return res.redirect('/login');
				}
				for (let v in formValues) {
					let updateField = (v === 'picture') ? (formValues[v]) : (formValues[v] !== user[v]);
					if (updateField && (v === 'email') && (!await(emailIsAvailable(formValues[v])))) {
						updateField = false;
					}
					if (updateField) {
						user[v] = formValues[v];
					}
				}
				await user.save();
				return res.redirect(`/users/${user._id.toString()}`);
			}
		} catch(err) {
			return next(err);
		}
	})
	.post('/login', async (req,res,next) => {
		const formValues = prepareFormData(registerFormConfig,req);
		let formIsValid = loginFormConfig.validateForm(formValues);
		if (!formIsValid) {
			return next();
		}
		passport.authenticate('local',(err, user, info) => {
			if (err) {
				return next(err);
			}
			if (user) {
				req.login(user,err=>{
					if (err) {
						return next(err);
					} else {
						return res.redirect('/');
					}
				});
			} else {
				req.exportVar('formError',info.message);
				return next();
			}
		})(req,res,next);

	}, renderApp)
	.get('/logout', async (req,res) => {
		req.logout();
		res.redirect('back');
	})
	.get('/*', renderApp);

export default server;
