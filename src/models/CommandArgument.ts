import { CommandHandler } from "./CommandHandler";
import { Message } from "discord.js";
import { IArgumentInfo } from "./IArgumentInfo";
import { CommandArgumentType } from "./CommandArgumentType";
import { IArgumentResult } from "./IArgumentResult";
import { stripIndents, oneLine } from 'common-tags';
const { escapeMarkdown } = require('discord.js');

export class CommandArgument {
	private name: string;
	private label: string;
	private prompt: string;
	private error: string;
	private type: CommandArgumentType;
	private min: number;
	private max: number;
	private default: string;
	private oneOf: string[];
	private infinite: boolean;
	private validate: Function;
	private parse: Function;
	private isEmpty: Function;
	private waitTime: number;
	private _commandHandler: CommandHandler;

	async obtain(msg: Message, val: string, promptLimit: Number = Infinity): Promise<IArgumentResult> {
		let argIsEmpty: boolean = this.isEmpty();
		const prompts = [];
		const answers = [];
		if(argIsEmpty && this.default !== null){ 
			return {
				value: this.default,
				cancelled: null,
				prompts,
				answers,
			}
		}

		if(this.infinite) return this.obtainInfinite(msg, [val], promptLimit);

		const wait = this.waitTime > 0 && this.waitTime !== Infinity ? this.waitTime * 1000 : undefined;
		let valid = !argIsEmpty ? await this.validate() : false;

		while(!valid || typeof valid === 'string'){
			if(prompts.length >= promptLimit){
				return {
					value: this.default,
					cancelled: null,
					prompts,
					answers,
				}
			}

			prompts.push(await msg.reply(stripIndents`
				${argIsEmpty ? this.prompt : valid ? valid : `You provided an invalid ${this.label}. Please try again.`}
				${oneLine`
					Respond with \`cancel\` to cancel the command.
					${wait ? `The command will automatically be cancelled in ${wait} seconds.` : ''}
				`}
			`));

			const responses = await msg.channel.awaitMessages(msg2 => msg2.author.id === msg.author.id, {
				max: 1,
				time: wait
			});

			if(responses && responses.size === 1) {
				answers.push(responses.first());
				val = answers[answers.length - 1].content;
			} else {
				return {
					value: null,
					cancelled: 'time',
					prompts,
					answers,
				}
			}

			if(val.toLowerCase() === 'cancel'){
				return {
					value: null,
					cancelled: 'user',
					prompts,
					answers
				};
			}

			argIsEmpty = this.isEmpty(val, msg);
			valid = await this.validate(val, msg);
		}

		return {
			value: await this.parse(val, msg),
			cancelled: null,
			prompts,
			answers
		};
	}
	
	async obtainInfinite(msg: Message, vals: string[], promptLimit: Number = Infinity): Promise<IArgumentResult>{
		const wait = this.waitTime > 0 && this.waitTime !== Infinity ? this.waitTime * 1000 : undefined;
		let results = [];
		let prompts = [];
		let answers = [];
		let currentVal = 0;

		while(true) {
			/* eslint-disable no-await-in-loop */
			let val = vals && vals[currentVal] ? vals[currentVal] : null;
			let valid = val ? await this.validate(val, msg) : false;
			let attempts = 0;

			while(!valid || typeof valid === 'string') {
				attempts++;
				if(attempts > promptLimit) {
					return {
						value: null,
						cancelled: 'promptLimit',
						prompts,
						answers
					};
				}

				// Prompt the user for a new value
				if(val) {
					const escaped = escapeMarkdown(val).replace(/@/g, '@\u200b');
					prompts.push(await msg.reply(stripIndents`
						${valid ? valid : oneLine`
							You provided an invalid ${this.label},
							"${escaped.length < 1850 ? escaped : '[too long to show]'}".
							Please try again.
						`}
						${oneLine`
							Respond with \`cancel\` to cancel the command, or \`finish\` to finish entry up to this point.
							${wait ? `The command will automatically be cancelled in ${this.waitTime} seconds.` : ''}
						`}
					`));
				} else if(results.length === 0) {
					prompts.push(await msg.reply(stripIndents`
						${this.prompt}
						${oneLine`
							Respond with \`cancel\` to cancel the command, or \`finish\` to finish entry.
							${wait ? `The command will automatically be cancelled in ${this.waitTime} seconds, unless you respond.` : ''}
						`}
					`));
				}

				// Get the user's response
				const responses = await msg.channel.awaitMessages(msg2 => msg2.author.id === msg.author.id, {
					max: 1,
					time: wait
				});

				// Make sure they actually answered
				if(responses && responses.size === 1) {
					answers.push(responses.first());
					val = answers[answers.length - 1].content;
				} else {
					return {
						value: null,
						cancelled: 'time',
						prompts,
						answers
					};
				}

				// See if they want to finish or cancel
				const lc = val.toLowerCase();
				if(lc === 'finish') {
					return {
						value: results.length > 0 ? results : null,
						cancelled: this.default ? null : results.length > 0 ? null : 'user',
						prompts,
						answers
					};
				}
				if(lc === 'cancel') {
					return {
						value: null,
						cancelled: 'user',
						prompts,
						answers
					};
				}

				valid = await this.validate(val, msg);
			}

			results.push(await this.parse(val, msg));

			if(vals) {
				currentVal++;
				if(currentVal === vals.length) {
					return {
						value: results,
						cancelled: null,
						prompts,
						answers
					};
				}
			}
		}
	}

	withInfo(info: IArgumentInfo): CommandArgument {
		this.name = info.name;
		this.label = info.label;
		this.prompt = info.prompt;
		this.error = info.error;
		this.type = CommandArgument.determineType(this._commandHandler, info.type);
		return this;
	}

	static determineType(commandHandler: CommandHandler, id: string): CommandArgumentType {
		if(!id) return null;
		let type = commandHandler.$argumentTypes.get(id);
		return type;
	}

	static validateInfo(info){
		
	}


    /**
     * Getter $name
     * @return {string}
     */
	public get $name(): string {
		return this.name;
	}

    /**
     * Getter $label
     * @return {string}
     */
	public get $label(): string {
		return this.label;
	}

    /**
     * Getter $prompt
     * @return {string}
     */
	public get $prompt(): string {
		return this.prompt;
	}

    /**
     * Getter $error
     * @return {string}
     */
	public get $error(): string {
		return this.error;
	}

    /**
     * Getter $type
     * @return {CommandArgument}
     */
	public get $type(): CommandArgumentType {
		return this.type;
	}

    /**
     * Getter $min
     * @return {number}
     */
	public get $min(): number {
		return this.min;
	}

    /**
     * Getter $max
     * @return {number}
     */
	public get $max(): number {
		return this.max;
	}

    /**
     * Getter $default
     * @return {string}
     */
	public get $default(): string {
		return this.default;
	}

    /**
     * Getter $oneOf
     * @return {string[]}
     */
	public get $oneOf(): string[] {
		return this.oneOf;
	}

    /**
     * Getter $infinite
     * @return {boolean}
     */
	public get $infinite(): boolean {
		return this.infinite;
	}

    /**
     * Getter $validate
     * @return {Function}
     */
	public get $validate(): Function {
		return this.validate();
	}

    /**
     * Getter $parse
     * @return {Function}
     */
	public get $parse(): Function {
		return this.parse();
	}

    /**
     * Getter $isEmpty
     * @return {Function}
     */
	public get $isEmpty(): Function {
		return this.isEmpty();
	}

    /**
     * Getter $waitTime
     * @return {number}
     */
	public get $waitTime(): number {
		return this.waitTime;
	}

    /**
     * Getter commandHandler
     * @return {CommandHandler}
     */
	public get commandHandler(): CommandHandler {
		return this._commandHandler;
	}

    /**
     * Setter $name
     * @param {string} value
     */
	public set $name(value: string) {
		this.name = value;
	}

    /**
     * Setter $label
     * @param {string} value
     */
	public set $label(value: string) {
		this.label = value;
	}

    /**
     * Setter $prompt
     * @param {string} value
     */
	public set $prompt(value: string) {
		this.prompt = value;
	}

    /**
     * Setter $error
     * @param {string} value
     */
	public set $error(value: string) {
		this.error = value;
	}

    /**
     * Setter $type
     * @param {CommandArgumentType} value
     */
	public set $type(value: CommandArgumentType) {
		this.type = value;
	}

    /**
     * Setter $min
     * @param {number} value
     */
	public set $min(value: number) {
		this.min = value;
	}

    /**
     * Setter $max
     * @param {number} value
     */
	public set $max(value: number) {
		this.max = value;
	}

    /**
     * Setter $default
     * @param {string} value
     */
	public set $default(value: string) {
		this.default = value;
	}

    /**
     * Setter $oneOf
     * @param {string[]} value
     */
	public set $oneOf(value: string[]) {
		this.oneOf = value;
	}

    /**
     * Setter $infinite
     * @param {boolean} value
     */
	public set $infinite(value: boolean) {
		this.infinite = value;
	}

    /**
     * Setter $validate
     * @param {Function} value
     */
	public set $validate(value: Function) {
		this.validate = value;
	}

    /**
     * Setter $parse
     * @param {Function} value
     */
	public set $parse(value: Function) {
		this.parse = value;
	}

    /**
     * Setter $isEmpty
     * @param {Function} value
     */
	public set $isEmpty(value: Function) {
		this.isEmpty = value;
	}

    /**
     * Setter $waitTime
     * @param {number} value
     */
	public set $waitTime(value: number) {
		this.waitTime = value;
	}

    /**
     * Setter commandHandler
     * @param {CommandHandler} value
     */
	public set commandHandler(value: CommandHandler) {
		this._commandHandler = value;
	}

}
