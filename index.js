const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const Parser = require('rss-parser');
const parser = new Parser();
const { token, stakingId, storingId } = require("./config.json");
const getStoringen = require('./api/request.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const feedUri = 'https://feeds.nos.nl/nosnieuwsalgemeen';
var lastMessage;
let lastSent = new Set();

client.once('ready', () => {
  console.log(`Bot is online: ${client.user.tag}`);
  checkFeed();
  checkForStoringen();
  setInterval(checkFeed, 300000); // elke 5 minuten
  setInterval(checkForStoringen, 1800000); // elke 30 minuten
});

async function checkFeed() {
  const feed = await parser.parseURL(feedUri);
  for (const item of feed.items) {
    const title = item.title.toLowerCase();
    const isNSStaking = title.includes("ns") && title.includes("staking");
    
    if (isNSStaking && !lastSent.has(item.link)) {
      const channel = await client.channels.fetch(stakingId);
      channel.send(`@everyone **NS Staking Nieuws** \n${item.title}\n${item.link}`);
      lastSent.add(item.link);
    }
  }
}

async function checkForStoringen() {
  const channel = await client.channels.fetch(storingId)
  if (lastMessage != null) {
    await lastMessage.delete();
  }
  var storingen = await getStoringen();
  lastMessage = await channel.send(`Actieve storingen in Zwolle: \n${storingen}`);
}

client.login(token);
