import {CommandContext} from './CommandContext';

export interface Command {
	readonly name: string;
	readonly alias: string[];
	getHelpMessage(messageContext: CommandContext): object[];
	run(parsedUserCommand: CommandContext): Promise<void>;
	hasPermissionsToRun(parsedUserCommand: CommandContext): boolean;
}