import { Message } from "discord.js";
import { Command } from "./Command";
import { CommandContext } from "./CommandContext";
import { Reactor } from "./Reactor";
import { injectable } from "inversify";
import { CommandGroup } from './CommandGroup';
import { CommandArgument } from "./CommandArgument";

@injectable()
export class CommandHandler {
	private commandGroups: CommandGroup[];
	private readonly serverPrefix: Map<string, string>;
	private readonly reactor: Reactor;
	private readonly argumentTypes: Map<string, CommandArgument>;
	
	constructor(serverPrefix: Map<string, string>, reactor: Reactor, argumentTypes: Map<string, CommandArgument>){
		this.reactor = reactor;
		this.serverPrefix = serverPrefix;
		this.argumentTypes = argumentTypes;
	}

	getArgumentTypes(){
		return this.argumentTypes;
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
		const commandContext: CommandContext = new CommandContext(message, this.getGuildPrefix(message), this.commandGroups);
		const command: Command = this.findCommand(commandContext);
		try {
			await command.run(commandContext);
			await this.reactor.success(message);
		} catch (err) {
			console.log(err)
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