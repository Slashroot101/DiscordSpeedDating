import {Message} from "discord.js";
import {CommandGroup} from "./CommandGroup";
import {RealArgument} from './RealArgument';

export class CommandContext {
	readonly parsedCommandName: string;
	readonly args: RealArgument[];
	readonly originalMessage: Message;
	readonly commandPrefix: string;
	readonly commandGroups: CommandGroup[];

	constructor(message: Message, prefix: string, commandGroups: CommandGroup[]){
		this.commandPrefix = prefix;
		const splitMessage = message.content.slice(prefix.length).split(/ +/g);
		this.commandGroups = commandGroups;
		this.parsedCommandName = splitMessage.shift().toLowerCase();
		this.args = splitMessage.map((args, index) => new RealArgument(args, index));
		this.originalMessage = message;
	}
}