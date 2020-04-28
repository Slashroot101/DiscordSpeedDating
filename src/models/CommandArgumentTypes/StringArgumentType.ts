import {CommandArgumentType} from '../CommandArgumentType';
import {Message} from 'discord.js';
import {CommandArgument} from '../CommandArgument';

class StringArgumentType extends CommandArgumentType {
	constructor(){
		super('string');
	}

	validate(val: string, msg: Message, arg: CommandArgument): boolean | string{
		if(arg.getOneOf() && !arg.getOneOf().includes(val.toLowerCase())) {
			return `Please enter one of the following options: ${arg.getOneOf().map(opt => `\`${opt}\``).join(', ')}`;
		}
		if(arg.getMin() !== null && typeof arg.getMin() !== 'undefined' && val.length < arg.getMin()) {
			return `Please keep the ${arg.getLabel()} above or exactly ${arg.getMin()} characters.`;
		}
		if(arg.getMax() !== null && typeof arg.getMax() !== 'undefined' && val.length > arg.getMax()) {
			return `Please keep the ${arg.getLabel()} below or exactly ${arg.getMax()} characters.`;
		}
		return true;
	}

	parse(val): string {
		return val;
	}
}

export default StringArgumentType;