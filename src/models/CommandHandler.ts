import { Message } from "discord.js";
import { Command } from "./Command";
import { CommandContext } from "./CommandContext";
import { Reactor } from "./Reactor";
import {injectable} from "inversify";
import {CommandGroup} from './CommandGroup';
@injectable()
export class CommandHandler {
	private commandGroups: CommandGroup[];
	private readonly serverPrefix: Map<string, string>;
	private readonly reactor: Reactor;
	
	constructor(serverPrefix: Map<string, string>, reactor: Reactor){
		this.reactor = reactor;
		this.serverPrefix = serverPrefix;
	}

	withCommandGroup(commandGroups: CommandGroup): CommandHandler{
		this.commandGroups.push(commandGroups);
		return this;
	}

	withCommandGroups(commandGroups: CommandGroup[]): CommandHandler {
		this.commandGroups = commandGroups;
		return this;
	}

	async handleMessage(message: Message): Promise<void> {
		if(message.author.bot || !this.isCommand(message)){
			return;
		}
		const commandContext = new CommandContext(message, this.getGuildPrefix(message));
		const command: Command = this.findCommand(commandContext);
		try {
			await command.run(commandContext);
			await this.reactor.success(message);
		} catch (err) {
			await this.reactor.failure(message);
		}
	}

	getGuildPrefix(message: Message): string{
		return this.serverPrefix.get(message.guild.id);
	}

	private findCommand(context: CommandContext): Command {
		let command: Command = null;
		for(let commandGroup of this.commandGroups){
			command = commandGroup.findCommand(context);
			if(command !== null) { break };
		}
		return command;
	}

	private isCommand(message: Message): boolean {
		return message.content.startsWith(this.getGuildPrefix(message));
	}
}