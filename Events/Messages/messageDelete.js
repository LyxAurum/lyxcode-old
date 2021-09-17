const { MessageLogs } = require('../../configuration.json')
const { Message, MessageEmbed }= require('discord.js');

module.exports = {
    name: 'messageDelete',
    execute(client, message) {
        if (message.author.bot) return;

        const Deleted = message.content;
        const count = 1015;
        const Result = Deleted.slice(0, count) + (Deleted.length > count ? "..." : "");

        message.guild.channels.cache.get(MessageLogs).send({embeds: [new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamci: true, size: 512}))
            .setDescription(`Deleted a [message](${message.url}) in ${message.channel}.`)
            .addField(`Deleted`, `\`\`\`${Result}\`\`\``, true).setColor("RED")]}
        );
   }
};