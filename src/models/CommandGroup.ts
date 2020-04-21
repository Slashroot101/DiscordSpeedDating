import { Command } from './Command';
import { CommandContext } from "./CommandContext";

export class CommandGroup {
	private groupName: string;
	private commands: Command[];
	private description: string;

	constructor(groupName: string, description: string){
		this.groupName = groupName;
		this.description = description;
	}

	registerCommandsInPath(path: string): CommandGroup {
		const files = require('require-all')(
			{
				dirname: path,
				filter: /.js$/,
				recursive: false,
			}
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

	getHelpMessage(): string {
		let ret: string = `${this.groupName} -- ${this.description}\n`;
		ret += this.commands.map(command => command.getHelpMessage()).join('\n');
		return ret;
	}
}