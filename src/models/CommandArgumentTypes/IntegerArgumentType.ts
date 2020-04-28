import {CommandArgumentType} from '../CommandArgumentType';
import {Message} from 'discord.js';
import {CommandArgument} from '../CommandArgument';

export class IntegerArgumentType extends CommandArgumentType {
	constructor(){
		super('integer');
	}

	async validate(val: string, msg: Message, arg: CommandArgument): Promise<boolean | string> {
		const int = Number.parseInt(val);
		if(Number.isNaN(int)) return false;
		if(arg.getOneOf() && !arg.getOneOf().includes(val)) {
			return `Please enter one of the following options: ${arg.getOneOf().map(opt => `\`${opt}\``).join(', ')}`;
		}
		if(arg.getMin() !== null && typeof arg.getMin() !== 'undefined' && int < arg.getMin()) {
			return `Please enter a number above or exactly ${arg.getMin()}.`;
		}
		if(arg.getMax() !== null && typeof arg.getMax() !== 'undefined' && int > arg.getMax()) {
			return `Please enter a number below or exactly ${arg.getMax()}.`;
		}
		return true;
	}

	parse(val) : number {
		return Number.parseInt(val);
	}
}