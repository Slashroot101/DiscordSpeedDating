import { CommandArgument } from "./CommandArgument";
import { CommandHandler } from "./CommandHandler";

export interface IArgumentInfo {
	name: string;
	label: string;
	prompt: string;
	error: string;
	type: string;
	min: number;
	max: number;
	default: string;
	oneOf: string[];
	infinite: boolean;
	validate: Function;
	parser: Function;
	isEmpty: Function;
	waitTime: number;
	commandHandler: CommandHandler;
}