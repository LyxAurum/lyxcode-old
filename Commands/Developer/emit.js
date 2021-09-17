const { CommandInteraction, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: "emit",
    description: "Emit the selected event.",
    perms: "ADMINISTRATOR",
    options: [
        {
            name: "event",
            description: "Select an event to emit.",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "guildMemberAdd",
                    value: "guildmemberadd"
                },
                {
                    name: "guildMemberRemove",
                    value: "guildmemberemove"
                }
            ]
        }
    ], 
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const C = interaction.options.getString("event");

        const Response = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor("EVENT EMITTERS", interaction.guild.iconURL({dynamic: true}))
        switch(C) {
            case "guildmemberadd" : {
                client.emit("guildMemberAdd", interaction.member);
                Response.setDescription("Just emitted guildMemberAdd")
                interaction.reply({embeds: [Response], ephemeral: true})
            }
            break;
            case "guildmemberemove" : {
                client.emit("guildMemberRemove", interaction.member);
                Response.setDescription("Just emitted guildMemberRemove")
                interaction.reply({embeds: [Response], ephemeral: true})
            }
            break
        }
    }
}