const { Client, CommandInteraction, MessageEmbed } = require('discord.js')

module.exports = {
    name: "userinfo",
    description: "Displays the target's information.",
    options:[
        {
            name: "target",
            description: "Select a target.",
            type: "USER",
            required: true,
        },
    ],
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    execute(client, interaction) {
        const Target = interaction.options.getMember('target');

        const Response = new MessageEmbed()
        .setAuthor(`${Target.user.username}`, `${Target.user.displayAvatarURL({dynamic: true})}?size=256`)
        .setThumbnail(`${Target.user.displayAvatarURL({dynamic: true})}?size=256)`)
        .setColor("#2f3136")
        .addField("UserID", `${Target.user.id}`, false)
        .addField("Server Member Since", `<t:${parseInt(Target.joinedTimestamp / 1000)}:R>`)
        .addField("Discord User Since", `<t:${parseInt(Target.user.createdTimestamp / 1000)}:R>`)

        if (Target.roles.cache.size > 1) {
            Response.addField("Roles", `${Target.roles.cache.map(r => r).join(' ').replace("@everyone", " ")}`)
        } else {
            Response.addField("Roles", `No Roles to display.`)
        }

        interaction.reply({embeds: [Response], ephemeral: false});
    }
}