import { type SlashCommandBuilder, type Awaitable, type BaseInteraction, type CommandInteraction, type MessageComponentInteraction, type SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import { type HandlerType } from '../index';

export type ExecuteFunction<T extends HandlerType = HandlerType> = (
	interaction: T extends 'command' ? CommandInteraction<'raw'> : T extends 'component' ? MessageComponentInteraction<'raw'> : BaseInteraction<'raw'>,
) => Awaitable<void>;

export class Handler {
	private _execute?: ExecuteFunction;
	private _type: 'command' | 'component';
	constructor(type: 'command' | 'component') {
		this._type = type;
	}
	setExecute(fn: ExecuteFunction) {
		if (typeof fn !== 'function') throw new Error(`Invalid execute function. Expected function, received ${typeof fn}.`);
		this._execute = fn;
		return this;
	}
	get execute() {
		return this._execute;
	}
	get type() {
		return this._type;
	}
	toJSON() {
		return {
			type: this.type,
			execute: this.execute,
		};
	}
}

export class CommandHandler extends Handler {
	private _data?: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
	constructor() {
		super('command');
	}
	setData(data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>) {
		this._data = data;
		return this;
	}
	get data() {
		return this._data;
	}
	toJSON() {
		return {
			...super.toJSON(),
			data: this.data,
		};
	}
	setExecute(fn: ExecuteFunction<'command'>) {
		return super.setExecute(fn);
	}
	get execute(): ExecuteFunction<'command'> | undefined {
		return super.execute;
	}
}

export class ComponentHandler extends Handler {
	private _customId?: string;
	constructor() {
		super('component');
	}
	setCustomId(customId: string) {
		this._customId = customId;
		return this;
	}
	get customId() {
		return this._customId;
	}
	toJSON() {
		return {
			...super.toJSON(),
			data: this.customId,
		};
	}
	setExecute(fn: ExecuteFunction<'component'>) {
		return super.setExecute(fn);
	}
	get execute(): ExecuteFunction<'component'> | undefined {
		return super.execute;
	}
}
