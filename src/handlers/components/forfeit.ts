import { userMention } from 'discord.js';
import disableComponents from '../../util/disableButtons';
import parseCustomId from '../../util/parseCustomId';
import { ComponentHandler } from '../handler';

export default new ComponentHandler().setCustomId('forfeit').setExecute(async (i) => {
	if (!i.isButton()) return;
	const { p1, p2 } = parseCustomId(i.message.components[0].components[0].customId!, { p1: true, p2: true });
	if (!p1 || !p2) return void i.reply({ content: 'An error occurred: Button Invalid' });
	if (![p1, p2].includes(i.user.id))
		return void i.reply({
			content: "This isn't your game.",
			ephemeral: true,
		});
	await i.message.edit({
		content: `${userMention(i.user.id === p1 ? p2 : p1)} won the game by forfeit!`,
		components: i.message.components.map(disableComponents),
	});
	await i.reply({
		content: 'Forfeited successfully.',
		ephemeral: true,
	});
});
