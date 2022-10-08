import { ActionRowBuilder, ButtonStyle, ButtonBuilder } from "discord.js";

export const EMOJI_X = "❌";
export const EMOJI_O = "⭕";
export const EMOJI_EMPTY = "⬜";
export const FORFEIT_BUTTON = new ActionRowBuilder<ButtonBuilder>().setComponents(new ButtonBuilder({ customId: "forfeit", label: "Forfeit Game", style: ButtonStyle.Danger, emoji: "⚠" }))