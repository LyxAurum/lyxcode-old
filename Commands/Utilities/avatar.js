const { CommandInteraction, MessageEmbed } = require('discord.js')
require('../../Events/Client/ready'); // which executes 'mongoose.connect()'


module.exports = {
    name: "avatar",
    description: "Embeds the target member's avatar.",
    options:[
        {
            name: "target",
            description: "Select a target.",
            type: "USER",
            required: true,
        },
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    execute(client, interaction) {
        const Target = interaction.options.getUser('target');
        var mongoose = require('mongoose');
        console.log(mongoose.connection.readyState);
        interaction.reply({embeds: 
            [new MessageEmbed()
            .setAuthor(`${Target.username}'s Avatar`, `${Target.displayAvatarURL({dynamic: true, size: 512})}`)
            .setImage(`${Target.displayAvatarURL({dynamic: true, size: 512})}`)
            .setColor("#2f3136")
            ]
        });
    }
}
