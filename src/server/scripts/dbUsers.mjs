import {config as dotEnvConfig} from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';
import User from '../data/model/User.mjs';

(async ()=>{
	try {
		dotEnvConfig();
		mongoose.connect(process.env.RAZZLE_MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log(`Connecting to mongoDB database...`);
		const db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', ()=>console.log("MongoDB connection successful"));

		if (process.argv[2] === "remove") {
			await(User.deleteMany({}));
			console.log("All users removed from database");
		} else if (process.argv[2] === "create") {
			let nbUsers = 10;
			if (process.argv[3] > 0) {
				nbUsers = Math.min(1 * process.argv[3], 5000);
			}
			const rawUsers = (await axios.get(`https://randomuser.me/api/?inc=name,email,picture&noinfo&results=${nbUsers}`)).data.results;
			for (let i = 0; i < rawUsers.length; i++) {
				const u = rawUsers[i];
				const userObj = {
					firstName: u.name.first,
					lastName: (Math.random() < 0.8) ? u.name.last : undefined,
					email: u.email,
					status: "Teacher,Teacher assistant,Student".split(',')[Math.floor(Math.random() * 3.75)],
					picture: {
						fileName: "picture.jpg",
						mimeType: "image/jpeg",
						data: await(
							axios.get(u.picture.large, {
								responseType: 'arraybuffer'
							}).then(response => Buffer.from(response.data, 'binary'))
						),
					},
					newsletter: (Math.random() < 0.5)
				};
				const dbUser = new User(userObj);
				await(dbUser.save());
			}
			console.log(`${nbUsers} random users added to database`);
		} else {
			if(process.argv[2]) {
				console.log(`Unknown command : ${process.argv[2]}`);
			} else {
				console.log(`No command specified.`);
			}
		}

		process.exit(0);
	} catch(err) {
		console.error(err);
		process.exit(1);
	}
})();
