import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';
import { Board } from '../../util/board';
import { FORFEIT_BUTTON } from '../../util/constants';
import { CommandHandler } from '../handler';

export default new CommandHandler()
	.setData(
		new SlashCommandBuilder()
			.setName('tic-tac-toe')
			.setDescription('Play tic-tac-toe with another user.')
			.addUserOption((user) => user.setName('user').setDescription('The user to play with.').setRequired(true)),
	)
	.setExecute((interaction) => {
		const target = interaction.options.getUser('user', true);
		if (target.bot)
			return void interaction.reply({
				content: 'You cannot play against a bot.',
				ephemeral: true,
			});
		if (interaction.user.id === target.id)
			return void interaction.reply({
				content: 'You cannot play against yourself.',
				ephemeral: true,
			});
		const components = Array.from({ length: 3 }, (_, i) =>
			Array.from(
				{ length: 3 },
				(_, j) =>
					new ButtonBuilder({
						// format: place.x-y.currentId.nextId.side
						customId: `place.${j}-${i}.${target.id}.${interaction.user.id}.red`,
						style: ButtonStyle.Success,
						label: 'Place',
						emoji: '⚫',
					}),
			),
		).map((c) => new ActionRowBuilder<ButtonBuilder>().setComponents(c));
		components.push(FORFEIT_BUTTON);
		interaction.reply({
			content: `${target}\n${new Board()}`,
			components,
		});
	})
	.toJSON();
