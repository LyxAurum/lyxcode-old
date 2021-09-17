const { Client, Collection, Intents } = require('discord.js');
const { Token } = require('./configuration.json')

const client = new Client({intents: 
    [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
    ]   
});

module.exports = client;

client.commands = new Collection();

['Events', 'Commands'].forEach(handler => {
    require(`./Handlers/${handler}`)(client);
});

client.login(Token);