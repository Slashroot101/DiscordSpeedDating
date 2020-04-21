import {MessageContext} from './MessageContext';

export interface Command {
	readonly name: string;
	readonly alias: string[];
	getHelpMessage(): string;
	run(parsedUserCommand: MessageContext): Promise<void>;
	hasPermissionsToRun(parsedUserCommand: MessageContext): boolean;
}