import {Message} from 'discord.js';
import {CommandArgument} from './CommandArgument';

export class CommandArgumentType {
	private readonly id: string;
	constructor(id){
		this.id = id;
	}

	validate(val: string, msg: Message, arg: CommandArgument) : Promise<boolean | string> {
		throw new Error(`${this.constructor.name} doesn't have a validate() method.`);
	}

	parse(val: string, msg: Message, arg: CommandArgument): any {
		throw new Error(`${this.constructor.name} doesn't have a parse() method.`);
	}

	isEmpty(val: string, msg: Message, arg: CommandArgument): boolean {
		if(Array.isArray(val)) return val.length === 0;
		return !val;
	}
}
