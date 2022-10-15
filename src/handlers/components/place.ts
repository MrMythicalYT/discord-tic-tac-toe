import {
  ActionRowBuilder,
  type APIButtonComponentWithCustomId,
  type ButtonBuilder,
  userMention,
} from "discord.js";
import parseBoard, { type Side } from "../../util/board";
import { EMOJI_O, EMOJI_EMPTY, EMOJI_X } from "../../util/constants";
import disableComponents from "../../util/disableButtons";
import parseCustomId from "../../util/parseCustomId";
import { ComponentHandler } from "../handler";

export default new ComponentHandler()
  .setCustomId("place")
  .setExecute((interaction) => {
    if (!interaction.isButton()) return;
    const { location, currentUser, nextUser, side } = parseCustomId(
      interaction.customId,
      { location: true, currentUser: true, nextUser: true, side: true }
    );
    if (interaction.user.id !== currentUser) {
      return void interaction.reply({
        content:
          interaction.user.id === nextUser
            ? "It's not your turn."
            : "This is not your game.",
        ephemeral: true,
      });
    }
    const board = parseBoard(
      interaction.message.content.split("\n").slice(1).join("\n")
    );
    console.log(board.toString());
    board.placeSpot(
      side as Side,
      location.split("-").map(Number).reverse() as [number, number]
    );
    console.log(board.toString());
    const newSide: Exclude<Side, null> = side === "O" ? "X" : "O";
    const rows = interaction.message.components.map((c) =>
      ActionRowBuilder.from(c)
    ) as ActionRowBuilder<ButtonBuilder>[];
    const editedRows = rows.map((row, i1) =>
      i1 < 3
        ? row.setComponents(
            row.components.map((c, i2) =>
              c
                .setCustomId(
                  (c.data as APIButtonComponentWithCustomId).custom_id.slice(
                    0,
                    10
                  ) +
                    nextUser +
                    "." +
                    currentUser +
                    "." +
                    newSide
                )
                .setEmoji(
                  board.circles[i1][i2] === "O"
                    ? EMOJI_O
                    : board.circles[i1][i2] === "X"
                    ? EMOJI_X
                    : EMOJI_EMPTY
                )
            )
          )
        : row
    );
    const winner = board.winner();
    if (winner) {
      return void interaction.update({
        content: `${interaction.user} wins by 3 in a row!\n${board}`,
        components: editedRows.map(disableComponents),
      });
    }
    return void interaction.update({
      components: editedRows,
      content: `${userMention(nextUser)}\n${board}`,
    });
  });
