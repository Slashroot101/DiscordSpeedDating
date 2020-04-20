import { Command } from "../models/command";
import { CommandContext } from "../models/CommandContext";

export class Ping implements Command {
		readonly commandNames = ['ping', 'Ping'];

		async run(parsedUserCommand: CommandContext): Promise<void> {
			await parsedUserCommand.originalMessage.reply("Pong!");
		}

		getHelpMessage(commandPrefix: string): string{
			return `Use ${commandPrefix}ping to pong!`;
		}

		hasPermissionsToRun(parsedUserCommnad: CommandContext): boolean {
			return true;
		}
}