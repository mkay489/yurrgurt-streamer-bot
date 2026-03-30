const axios = require("axios");
const fs = require("fs");

let accessToken = null;

async function getToken() {
  const res = await axios.post("https://id.twitch.tv/oauth2/token", null, {
    params: {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_SECRET,
      grant_type: "client_credentials"
    }
  });
  accessToken = res.data.access_token;
}

async function checkStreams(client) {
  const streamers = JSON.parse(fs.readFileSync("./data/streamers.json"));

  for (let streamer of streamers) {
    const res = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${streamer.name}`, {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        "Authorization": `Bearer ${accessToken}`
      }
    });

    const isLive = res.data.data.length > 0;

    if (isLive && !streamer.live) {
      streamer.live = true;
      const data = res.data.data[0];
      const channel = await client.channels.fetch(process.env.LIVE_CHANNEL);

      channel.send({
        content: `<@&${process.env.PING_ROLE}> 🔴 ${streamer.name} ist LIVE!`,
        embeds: [{
          title: data.title,
          url: `https://twitch.tv/${streamer.name}`,
          image: {
            url: data.thumbnail_url.replace("{width}", "1280").replace("{height}", "720")
          }
        }]
      });
    }

    if (!isLive) streamer.live = false;
  }

  fs.writeFileSync("./data/streamers.json", JSON.stringify(streamers, null, 2));
}

module.exports = { getToken, checkStreams };
