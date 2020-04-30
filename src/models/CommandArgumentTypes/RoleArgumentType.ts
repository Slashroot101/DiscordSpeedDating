import {CommandArgumentType} from '../CommandArgumentType';
import {Message, Role} from 'discord.js';
import {CommandArgument} from '../CommandArgument';
import { disambiguation } from '../util';

export class RoleArgumentType extends CommandArgumentType {
	constructor(){
		super('role');
	}

	async validate(val: string, msg: Message, arg: CommandArgument): Promise<boolean | string> {
		const matches = val.match(/^(?:<@&)?([0-9]+)>?$/);
		if(matches) return msg.guild.roles.cache.has(matches[1]);
		const search = val.toLowerCase();
		let roles = msg.guild.roles.cache.filter(nameFilterInexact(search));
		if(roles.size === 0) return false;
		if(roles.size === 1) {
			if(arg.$oneOf && !arg.$oneOf.includes(roles.first().id)) return false;
			return true;
		}
		const exactRoles = roles.filter(nameFilterExact(search));
		if(exactRoles.size === 1) {
			if(arg.$oneOf && !arg.$oneOf.includes(exactRoles.first().id)) return false;
			return true;
		}
		if(exactRoles.size > 0) roles = exactRoles;
		return roles.size <= 15 ?
			`${disambiguation(roles.map(role => `${escapeMarkdown(role.name)}`), 'roles', null)}\n` :
			'Multiple roles found. Please be more specific.';
	}

	parse(val: string, msg: Message, arg: CommandArgument): Role {
		const matches = val.match(/^(?:<@&)?([0-9]+)>?$/);
		if(matches) return msg.guild.roles.cache.get(matches[1]) || null;
		const search = val.toLowerCase();
		const roles = msg.guild.roles.cache.filter(nameFilterInexact(search));
		if(roles.size === 0) return null;
		if(roles.size === 1) return roles.first();
		const exactRoles = roles.filter(nameFilterExact(search));
		if(exactRoles.size === 1) return exactRoles.first();
		return null;
	}
	
}

function escapeMarkdown(text) {
  var unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1'); // unescape any "backslashed" character
  var escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1'); // escape *, _, `, ~, \
  return escaped;
}

function nameFilterExact(search) {
	return thing => thing.name.toLowerCase() === search;
}

function nameFilterInexact(search) {
	return thing => thing.name.toLowerCase().includes(search);
}