require('dotenv').config(); // Recommended way of loading dotenv
import container from "./inversify.config";
import {TYPES} from "./types";
import {Bot} from "./bot";
import {readdir, fstat} from "fs";
import {CommandGroup} from './models/CommandGroup';

let bot = container.get<Bot>(TYPES.Bot);
bot.listen().then(async () => {
	let commandGroups = [
		new CommandGroup('Util', 'A group of utility commands').registerCommandsInPath(__dirname + '/commands'),
	];

	bot.withCommandGroups(commandGroups);
	
}).catch((error) => {
  console.log('Oh no! ', error)
});