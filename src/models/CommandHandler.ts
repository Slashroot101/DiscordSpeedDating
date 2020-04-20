import { Message } from "discord.js";
import { Command } from "./Command";
import { CommandContext } from "./CommandContext";
import { Reactor } from "./Reactor";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";

//commands
import {Ping} from '../commands/Ping';
@injectable()
export class CommandHandler {
	private commands: Command[];
	private readonly serverPrefix: Map<string, string>;
	private readonly reactor: Reactor;
	constructor(serverPrefix: Map<string, string>, reactor: Reactor){
		this.commands = [
			new Ping(),
		];
		this.reactor = reactor;
		this.serverPrefix = serverPrefix;
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
		const command = this.commands.find(command => command.commandNames.includes(context.parsedCommandName));
		return command;
	}

	private isCommand(message: Message): boolean {
		return message.content.startsWith(this.getGuildPrefix(message));
	}
}