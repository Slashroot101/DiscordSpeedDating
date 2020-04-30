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
		if(arg.$oneOf && !arg.$oneOf.includes(val)) {
			return `Please enter one of the following options: ${arg.$oneOf.map(opt => `\`${opt}\``).join(', ')}`;
		}
		if(arg.$min !== null && typeof arg.$min !== 'undefined' && float < arg.$min) {
			return `Please enter a number above or exactly ${arg.$min}.`;
		}
		if(arg.$max !== null && typeof arg.$max !== 'undefined' && float > arg.$max) {
			return `Please enter a number below or exactly ${arg.$max}.`;
		}
		return true;
	}

	parse(val: string): number {
		return Number.parseFloat(val);
	}
}