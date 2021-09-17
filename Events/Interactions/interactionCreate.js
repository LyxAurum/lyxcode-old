const { Client, CommandInteraction, MessageEmbed } = require('discord.js')

module.exports = {
    name: "interactionCreate",
     /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            
            if (!command) return interaction.reply({embeds: [
                new MessageEmbed()
                .setDescription("⛔ An error occured while trying to execute this command.")
                .setColor("RED")
            ]}) && client.commands.delete(interaction.commandName);
            
            command.execute(client, interaction);
        }
    }
}