import { CommandHandler } from "./CommandHandler";
import { Message } from "discord.js";

export class CommandArgument {
	private name: string;
	private label: string;
	private prompt: string;
	private error: string;
	private type: CommandArgument;
	private min: number;
	private max: number;
	private default: string;
	private oneOf: string[];
	private infinite: boolean;
	private validator: Function;
	private parser: Function;
	private emptyChecker: Function;
	private waitTime: number;
	private commandHandler: CommandHandler;

	constructor(commandHandler: CommandHandler){
		this.commandHandler = commandHandler;
	}

	public getOneOf(): string[] {
		return this.oneOf;
	}

	public getMin(): number {
		return this.min;
	}

	public getLabel(): string {
		return this.label;
	}

	public getMax(): number {
		return this.max;
	}

	async obtain(msg: Message, val: string, promptLimit: Number = Infinity): Promise<object> {

	}


	withInfo(info): CommandArgument{
		this.name = info.name;
		this.label = info.label;
		this.prompt = info.prompt;
		this.error = info.error;
		this.type = CommandArgument.determineType(this.commandHandler, info.type);
		return this;
	}

	static determineType(commandHandler: CommandHandler, id: string): CommandArgument{
		if(!id) return null;
		if(!id.includes('|')) return commandHandler.getArgumentTypes().get(id);
	
		let type = commandHandler.getArgumentTypes().get(id);
		return type;
	}

	static validateInfo(info){
		
	}
}
