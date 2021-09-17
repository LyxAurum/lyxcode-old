const config = require('../../configuration.json')
const { Message, MessageEmbed }= require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    execute(client, member) {
        const Role = member.guild.roles.cache.get(config.MemberRole)
        member.roles.add(Role)

        const WelcomeEmbed = new MessageEmbed()
        .setAuthor(`WELCOME`, member.user.displayAvatarURL({dynamic: true, size: 512}))
        .setDescription(`Welcome <@${member.user.id}> to the **${member.guild.name}**\'s Discord Server!\nMake sure to check the channels tagged below to get involved!\nLatest Member Count: **${member.guild.memberCount}**`)
        .addFields(
            {name: ':book: Information', value: `<#${config.InformationCHNL}>`, inline: true},
            {name: ':gift: Giveaways', value: `<#${config.GiveAwaysCHNL}>`, inline: true},
            {name: ':stars: Get Roles', value: `<#${config.RolesCHNL}>`, inline: true},
        )
        .setFooter(`${member.user.username}#${member.user.discriminator}`, member.user.displayAvatarURL({dynamic: true, size: 512}))
        .setColor('RANDOM')
        .setTimestamp()

        member.guild.channels.cache.get(config.WelcomeCHNL).send({content: `Welcome, <@${member.user.id}>`, embeds: [WelcomeEmbed]})

        /// LOGS ///
        member.guild.channels.cache.get(config.InfractionsLogs).send(new MessageEmbed() /// Log Embed
        .setDescription(`${member} just joined the server.`).setColor(config.GREEN));       
    }
}