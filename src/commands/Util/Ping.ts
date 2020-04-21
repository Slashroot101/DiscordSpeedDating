import { Command } from "../../models/command";
import { CommandContext } from "../../models/CommandContext";

class Ping implements Command {
		readonly name = 'ping';
		readonly alias = ['Ping'];

		async run(parsedUserCommand: CommandContext): Promise<void> {
			await parsedUserCommand.originalMessage.reply("Pong!");
		}

		getHelpMessage(): string{
			return `Use {prefix}ping to pong!`;
		}

		hasPermissionsToRun(parsedUserCommnad: CommandContext): boolean {
			return true;
		}
}

export default new Ping();