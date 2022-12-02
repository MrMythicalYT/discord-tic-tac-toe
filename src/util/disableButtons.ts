import { ActionRow, ActionRowBuilder, type MessageActionRowComponent, type MessageActionRowComponentBuilder } from 'discord.js';

export default function disableComponents(
	row: ActionRowBuilder<MessageActionRowComponentBuilder> | ActionRow<MessageActionRowComponent> | Array<MessageActionRowComponent | MessageActionRowComponentBuilder>,
): ActionRowBuilder<MessageActionRowComponentBuilder> {
	if (row instanceof ActionRowBuilder || row instanceof ActionRow) {
		const builder = ActionRowBuilder.from(row) as ActionRowBuilder<MessageActionRowComponentBuilder>;
		return builder.setComponents(builder.components.map((component) => component.setDisabled(true)));
	}
	const builder = new ActionRowBuilder({
		components: row,
	}) as ActionRowBuilder<MessageActionRowComponentBuilder>;
	return builder.setComponents(builder.components.map((component) => component.setDisabled(true)));
}
