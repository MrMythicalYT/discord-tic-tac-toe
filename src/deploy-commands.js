const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
require('dotenv/config');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const commands = [];
const cmds = readdirSync('./dist/handlers/application-commands').filter((i) => i.endsWith('.js'));
for (const handler of cmds) {
	const { default: handle } = require(`./handlers/application-commands/${handler}`);
	if (!handle.data) throw new Error(`Invalid command: ${handler}`);
	commands.push(handle.data.toJSON());
}

rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
	body: commands,
});
