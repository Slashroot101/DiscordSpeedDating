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
		if(arg.$oneOf && !arg.$oneOf.includes(val)) {
			return `Please enter one of the following options: ${arg.$oneOf.map(opt => `\`${opt}\``).join(', ')}`;
		}
		if(arg.$min !== null && typeof arg.$min !== 'undefined' && int < arg.$min) {
			return `Please enter a number above or exactly ${arg.$min}.`;
		}
		if(arg.$max !== null && typeof arg.$max !== 'undefined' && int > arg.$max) {
			return `Please enter a number below or exactly ${arg.$max}.`;
		}
		return true;
	}

	parse(val) : number {
		return Number.parseInt(val);
	}
}