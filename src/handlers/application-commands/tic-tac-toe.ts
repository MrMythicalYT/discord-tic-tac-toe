import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";
import { Board } from "../../util/board";
import { FORFEIT_BUTTON } from "../../util/constants";
import { CommandHandler } from "../handler";

export default new CommandHandler()
  .setData(
    new SlashCommandBuilder()
      .setName("tic-tac-toe")
      .setDescription("Play tic-tac-toe with another user.")
      .addUserOption((user) =>
        user
          .setName("user")
          .setDescription("The user to play with.")
          .setRequired(true)
      )
  )
  .setExecute((interaction) => {
    const components = Array.from({ length: 3 }, (_, i) =>
      Array.from(
        { length: 3 },
        (_, j) =>
          new ButtonBuilder({
            // format: place.x-y.id1.id2.side
            customId: `place.${j}-${i}.${interaction.user.id}.${
              interaction.options.get("user", true).value
            }.red`,
            style: ButtonStyle.Success,
            label: "Place",
            emoji: "⚫",
          })
      )
    ).map((c) => new ActionRowBuilder<ButtonBuilder>().setComponents(c));
    components.push(
      FORFEIT_BUTTON
    )
    interaction.reply({
      content: `${interaction.options.getUser("user")}\n${new Board()}`,
      components,
    });
  })
  .toJSON();
