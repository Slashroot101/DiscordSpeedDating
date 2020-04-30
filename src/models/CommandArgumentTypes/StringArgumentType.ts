import {CommandArgumentType} from '../CommandArgumentType';
import {Message} from 'discord.js';
import {CommandArgument} from '../CommandArgument';

class StringArgumentType extends CommandArgumentType {
	constructor(){
		super('string');
	}

	async validate(val: string, msg: Message, arg: CommandArgument): Promise<boolean | string>{
		if(arg.$oneOf && !arg.$oneOf.includes(val.toLowerCase())) {
			return `Please enter one of the following options: ${arg.$oneOf.map(opt => `\`${opt}\``).join(', ')}`;
		}
		if(arg.$min !== null && typeof arg.$min !== 'undefined' && val.length < arg.$min) {
			return `Please keep the ${arg.$min} above or exactly ${arg.$min} characters.`;
		}
		if(arg.$max !== null && typeof arg.$max !== 'undefined' && val.length > arg.$max) {
			return `Please keep the ${arg.$label} below or exactly ${arg.$label} characters.`;
		}
		return true;
	}

	parse(val: string): string {
		return val;
	}
}

export default StringArgumentType;