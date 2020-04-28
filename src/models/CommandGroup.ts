import { Command } from './Command';
import { CommandContext } from "./CommandContext";
import {resolve} from "path";

export class CommandGroup {
	private groupName: string;
	private commands: Command[];
	private description: string;

	constructor(groupName: string, description: string){
		this.groupName = groupName;
		this.description = description;
	}

	registerCommandsInPath(path: string): CommandGroup {
		console.log(path)
		const files = require('require-all')(
			{
				dirname: resolve(path),
				recursive: false
			},
		);
		const commands = [];
		for(const group of Object.values(files)) {
			for(let command of Object.values(group)) {
				if(typeof command.default === 'function') command = command.default;
				commands.push(command);
			}
		}

		this.commands = commands;
		return this;
	}

	findCommand(context: CommandContext): Command {
		const command = this.commands.find(command => command.name === context.parsedCommandName || command.alias.includes(context.parsedCommandName));
		return command;
	} 

	getHelpMessage(messageContext: CommandContext): object[] {
		let fields: object[] = [];
		this.commands.forEach((command, index) => {
			fields.push({
				name: `**${index === 0 ? this.groupName : '\u200b'}**`,
				value: `${command.hasPermissionsToRun(messageContext) ? ':white_check_mark:' : ':x:'} ${command.name}`,
				inline: true,
			});
		});
		if(fields.length % 3 !== 0){
			fields.push({
				name: '\u200b',
				value: '\u200b',
				inline: true,
			});
		}
		return fields;
	}
}