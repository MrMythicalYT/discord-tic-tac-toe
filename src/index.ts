import {
  Client,
  Collection,
  Events,
  type SlashCommandBuilder,
  type ContextMenuCommandBuilder,
  type CommandInteraction,
  type MessageComponentInteraction,
  Partials,
} from "discord.js";
import { readdirSync } from "fs";
import "dotenv/config";
import { type ExecuteFunction } from "./handlers/handler";
import parseCustomId from "./util/parseCustomId";
const client = new Client({
  intents: [],
  partials: [Partials.Message],
});
const handlers = new Collection<string, Handler>();

export type HandlerType = "command" | "component";
export interface Handler<T extends HandlerType = HandlerType> {
  customId: T extends "component"
    ? string
    : T extends "command"
    ? undefined
    : string | undefined;
  data: SlashCommandBuilder | ContextMenuCommandBuilder | undefined;
  execute: ExecuteFunction;
}

client.on(Events.ClientReady, () => {
  console.log("Ready!");
  const components = readdirSync("./dist/handlers/components")
    .filter((i) => i.endsWith(".js"))
    .map((cmd) => ({ cmd, type: 1 }));
  const cmds = readdirSync("./dist/handlers/application-commands")
    .filter((i) => i.endsWith(".js"))
    .map((cmd) => ({ cmd, type: 2 }));
  for (const handler of components.concat(...cmds)) {
    const { default: handle } = require(`./handlers/${
      handler.type === 1 ? "components" : "application-commands"
    }/${handler.cmd}`) as { default: Handler };
    if (
      typeof handle.execute !== "function" ||
      (!handle.data?.name && !handle.customId)
    )
      throw new Error(`Invalid handler: ${handler.cmd}`);
    handlers.set(handle.data?.name ?? handle.customId!, handle);
  }
});

client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.inGuild() || interaction.isAutocomplete()) return;
  if (!interaction.isCommand() && !interaction.isButton()) return;
  const key = interaction.isCommand()
    ? interaction.commandName
    : interaction.isButton()
    ? parseCustomId(interaction.customId).main
    : null;
  key
    ? handlers
        .get(key)
        ?.execute(
          interaction as
            | CommandInteraction<"raw">
            | MessageComponentInteraction<"raw">
        )
    : interaction.reply({
        content: "Error: no handler found. Please contact developer",
        ephemeral: true,
      });
});

client.login();
