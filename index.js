const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Bot läuft!"));
app.listen(3000, () => console.log("Webserver aktiv"));
require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const { getToken, checkStreams } = require("./twitch");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once("ready", async () => {
  console.log(`Bot online als ${client.user.tag}`);
  await getToken();
  setInterval(() => {
    checkStreams(client);
  }, 120000);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (command) command.execute(interaction);
});

client.login(process.env.DISCORD_TOKEN);
