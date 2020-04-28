import { Command } from "../../models/command";
import { CommandContext } from "../../models/CommandContext";

class Ping implements Command {
		readonly name: string = 'ping';
		readonly alias: string[] = ['Ping'];

		async run(parsedUserCommand: CommandContext): Promise<void> {
			await parsedUserCommand.originalMessage.reply("Pong!");
		}

		getHelpMessage(commandContext: CommandContext): object[] {
			return [{}];
		}

		hasPermissionsToRun(parsedUserCommnad: CommandContext): boolean {
			return true;
		}
}

export const ping = new Ping();