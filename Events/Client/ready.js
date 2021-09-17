const { DBURL } = require('../../configuration.json');
const { Client } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    name: "ready",
    once: true,
    /**
    * @param {Client} client
    */
    execute(client) {
        console.log(`Logged in as ${client.user.tag} ✅`);
        client.user.setStatus('dnd');
        client.user.setActivity({type: "WATCHING", name: "TKF!"});

        if(!DBURL) return;
        mongoose.connect(DBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log('The client is now connected to the database ✅')
        }).catch((err) => {
            console.log(err)
        });
    }
}
