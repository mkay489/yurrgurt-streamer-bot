const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addstreamer")
    .setDescription("Fügt einen Twitch Streamer hinzu")
    .addStringOption(opt =>
      opt.setName("name").setDescription("Twitch Name").setRequired(true)
    ),

  async execute(interaction) {
    const name = interaction.options.getString("name");
    let streamers = JSON.parse(fs.readFileSync("./data/streamers.json"));
    streamers.push({ name, live: false });
    fs.writeFileSync("./data/streamers.json", JSON.stringify(streamers, null, 2));
    await interaction.reply(`${name} hinzugefügt`);
  }
};
