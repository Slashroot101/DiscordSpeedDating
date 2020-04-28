import { Command } from "../../models/command";
import { CommandContext } from "../../models/CommandContext";

class Help implements Command {
	readonly name: string = 'help';
	readonly alias: string[] = ['hlp'];

	async run(parsedUserCommand: CommandContext): Promise<void> {
		try {
			if(parsedUserCommand.args.length > 0){

			} else {
				const fields: readonly object[] = parsedUserCommand.commandGroups.map(commandGroup => commandGroup.getHelpMessage(parsedUserCommand));
				await parsedUserCommand.originalMessage.author.send({embed: {
					color: 0x00ff00,
					author: {
						name: parsedUserCommand.originalMessage.member.user.tag,
						icon_url: parsedUserCommand.originalMessage.member.user.avatarURL,
					},
					title: `For help with a specific command, type \`{prefix}help <command name>\``,
					url: '',
					description: 'Emojis show if you have permission to run the command. It does NOT show discord level permissions at the moment.',
					fields,
					timestamp: new Date(),
				}})
			}
		} catch (err){
			console.log(err);
		}
	}

	getHelpMessage(commandContext: CommandContext): object[] {
		return [{}];
	}

	hasPermissionsToRun(parsedUserCommnad: CommandContext): boolean {
		return true;
	}
}

export const help = new Help();