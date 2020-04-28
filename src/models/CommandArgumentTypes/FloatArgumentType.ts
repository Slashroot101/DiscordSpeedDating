import {CommandArgumentType} from '../CommandArgumentType';
import {Message} from 'discord.js';
import {CommandArgument} from '../CommandArgument';

export class FloatArgumentType extends CommandArgumentType {
	constructor() {
		super('float');
	}

	async validate(val: string, msg: Message, arg: CommandArgument): Promise<boolean | string>  {
		const float = Number.parseFloat(val);
		if(Number.isNaN(float)) return false;
		if(arg.getOneOf() && !arg.getOneOf().includes(val)) {
			return `Please enter one of the following options: ${arg.getOneOf().map(opt => `\`${opt}\``).join(', ')}`;
		}
		if(arg.getMin() !== null && typeof arg.getMin() !== 'undefined' && float < arg.getMin()) {
			return `Please enter a number above or exactly ${arg.getMin()}.`;
		}
		if(arg.getMax() !== null && typeof arg.getMax() !== 'undefined' && float > arg.getMax()) {
			return `Please enter a number below or exactly ${arg.getMax()}.`;
		}
		return true;
	}

	parse(val: string): number {
		return Number.parseFloat(val);
	}
}