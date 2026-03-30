const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Kopf oder Zahl"),

  async execute(interaction) {
    const result = Math.random() > 0.5 ? "Kopf" : "Zahl";
    interaction.reply(`Ergebnis: ${result}`);
  }
};
