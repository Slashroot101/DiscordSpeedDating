require('dotenv').config(); // Recommended way of loading dotenv
import container from "./inversify.config";
import {TYPES} from "./types";
import {Bot} from "./bot";
import {readdir, fstat} from "fs";
import {Command} from './models/Command';
let bot = container.get<Bot>(TYPES.Bot);
bot.listen().then(async () => {
	readdir(`${__dirname}/commands`, async (err, files) => {
		if(err){
			console.log('Death by loading commands...', err);
		}
		const commands = [];
		for (const file of files) {
			if (file.substr(file.lastIndexOf('.') + 1) === 'js'){
				const command = (await import(`${__dirname}/commands/${file}`)).default;
				commands.push(command);
			}
		}
		bot.withCommands(commands);
		console.log('Logged in!')
	})
}).catch((error) => {
  console.log('Oh no! ', error)
});