import {MessageContext} from './MessageContext';

export interface Command {
	readonly commandNames: string[];
	getHelpMessage(commandPrefix: string): string;
	run(parsedUserCommand: MessageContext): Promise<void>;
	hasPermissionsToRun(parsedUserCommand: MessageContext): boolean;
}