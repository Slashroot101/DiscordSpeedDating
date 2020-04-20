import { Message } from "discord.js";
import { Command } from "./Command";
import { CommandContext } from "./CommandContext";
import { Reactor } from "./Reactor";
import {injectable} from "inversify";

@injectable()
export class CommandHandler {
	private commands: Command[];
	private readonly serverPrefix: Map<string, string>;
	private readonly reactor: Reactor;
	constructor(serverPrefix: Map<string, string>, reactor: Reactor){
		this.reactor = reactor;
		this.serverPrefix = serverPrefix;
	}

	withCommands(commands: Command[]): CommandHandler{
		this.commands = commands;
		return this;
	}

	async handleMessage(message: Message): Promise<void> {
		if(message.author.bot || !this.isCommand(message)){
			return;
		}
		const commandContext = new CommandContext(message, this.getGuildPrefix(message));
		const command = this.findCommand(commandContext);
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
		console.log(this.commands)
		const command = this.commands.find(command => command.name === context.parsedCommandName || command.alias.includes(context.parsedCommandName));
		return command;
	}

	private isCommand(message: Message): boolean {
		return message.content.startsWith(this.getGuildPrefix(message));
	}
}