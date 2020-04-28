import {CommandArgumentType} from '../CommandArgumentType';

export class BooleanArgumentType extends CommandArgumentType {
	private truthy: Set<string>;
	private falsy: Set<string>;

	constructor(){
		super('boolean');
		this.truthy = new Set(['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', '1', '+']);
		this.falsy = new Set(['false', 'f', 'no', 'n', 'off', 'disable', 'disabled', '0', '-']);
	}

	async validate(val: string): Promise<boolean | string> {
		const lc: string = val.toLowerCase();
		return this.truthy.has(lc) || this.falsy.has(lc);
	}

	parse(val: string): boolean | RangeError {
		const lc = val.toLowerCase();
		if(this.truthy.has(lc)) return true;
		if(this.falsy.has(lc)) return false;
		throw new RangeError('Unknown boolean value.');
	}
}