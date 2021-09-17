const { MessageLogs, YELLOW } = require('../../configuration.json')
const { MessageEmbed }= require('discord.js');

module.exports = {
    name: 'messageUpdate',
            /**
     * @param {Message} message
     */
    execute(client, oldMessage, newMessage) {
        if (oldMessage.content === newMessage.content) return;
        if (oldMessage.author.bot) return;
        
        const count = 1015;
        const oldText = oldMessage.content;
        const newText = newMessage.content;
        const oldResult = oldText.slice(0, count) + (oldText.length > count ? "..." : "");
        const newResult = newText.slice(0, count) + (newText.length > count ? "..." : "");

        oldMessage.guild.channels.cache.get(MessageLogs).send(new MessageEmbed()
        .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL({dynamci: true, size: 512}))
        .setDescription(`Edited a [message](${newMessage.url}) in ${oldMessage.channel}`)
        .addField(`Original`, `\`\`\`${oldResult}\`\`\``, true)
        .addField(`Edited`, `\`\`\`${newResult}\`\`\``, false).setColor("YELLOW")
        );
   }
};