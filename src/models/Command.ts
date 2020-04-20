import {MessageContext} from './MessageContext';

export interface Command {
	readonly name: string;
	readonly alias: string[];
	getHelpMessage(commandPrefix: string): string;
	run(parsedUserCommand: MessageContext): Promise<void>;
	hasPermissionsToRun(parsedUserCommand: MessageContext): boolean;
}