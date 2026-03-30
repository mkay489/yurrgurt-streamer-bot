const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Würfelt eine Zahl"),

  async execute(interaction) {
    const number = Math.floor(Math.random() * 6) + 1;
    interaction.reply(`Du hast eine ${number} gewürfelt!`);
  }
};
