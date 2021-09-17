const { InfractionsLogs } = require('../../configuration.json')
const { Message, MessageEmbed }= require('discord.js');

module.exports = {
    name: 'guildMemberRemove',
    log: 'LEAVE LOGS',
    async execute(client, member) {
        member.guild.channels.cache.get(InfractionsLogs).send({embeds: [new MessageEmbed().setDescription(`${member} just left the server.`).setColor("RED")]})    
    }
}