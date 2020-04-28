import {CommandArgumentType} from '../CommandArgumentType';
import {Message} from 'discord.js';
import {CommandArgument} from '../CommandArgument';
const { disambiguation } = require('../util');
const { escapeMarkdown } = require('discord.js')

export class MemberArgumentType extends CommandArgumentType {
	constructor() {
		super('member');
	}

	async validate(val: string, msg: Message, arg: CommandArgument): Promise<string | boolean> {
		const matches: RegExpMatchArray = val.match(/^(?:<@!?)?([0-9]+)>?$/);
		if(matches) {
			try {
				const member = await msg.guild.members.fetch(await msg.client.users.fetch(matches[1]));
				if(!member) return false;
				if(arg.getOneOf() && !arg.getOneOf().includes(member.id)) return false;
				return true;
			} catch(err) {
				return false;
			}
		}
		const search: string = val.toLowerCase();
		let members = msg.guild.members.cache.filter(memberFilterInexact(search));
		if(members.size === 0) return false;
		if(members.size === 1) {
			if(arg.getOneOf() && !arg.getOneOf().includes(members.first().id)) return false;
			return true;
		}
		const exactMembers = members.filter(memberFilterExact(search));
		if(exactMembers.size === 1) {
			if(arg.getOneOf() && !arg.getOneOf().includes(exactMembers.first().id)) return false;
			return true;
		}
		if(exactMembers.size > 0) members = exactMembers;
		return members.size <= 15 ?
			`${disambiguation(
				members.map(mem => `${escapeMarkdown(mem.user.username)}#${mem.user.discriminator}`), 'members', null
			)}\n` :
			'Multiple members found. Please be more specific.';
	}
}

function memberFilterExact(search) {
	return mem => mem.user.username.toLowerCase() === search ||
		(mem.nickname && mem.nickname.toLowerCase() === search) ||
		`${mem.user.username.toLowerCase()}#${mem.user.discriminator}` === search;
}

function memberFilterInexact(search) {
	return mem => mem.user.username.toLowerCase().includes(search) ||
		(mem.nickname && mem.nickname.toLowerCase().includes(search)) ||
		`${mem.user.username.toLowerCase()}#${mem.user.discriminator}`.includes(search);
}