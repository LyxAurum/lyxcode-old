const { CommandInteraction, MessageEmbed } = require("discord.js");
const { InfractionsLogs, LyxPurp, Entrance } = require('../../configuration.json');
const db = require('../../Models/infractionsData');

module.exports = {
    name: "warning",
    description: "Warnings System.",
    perms: "KICK_MEMBERS",
    options: [
        {
            name: "add",
            description: "Issues a warning to the target member.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "member",
                    description: "Select a member to warn.",
                    type: "USER",
                    required: true
                },
                {
                    name: "reason",
                    description: "Provide a reason for this warning.",
                    type: "STRING",
                    required: true
                },
            ]
        },
        {
            name: "remove",
            description: "Removes a specific warning by ID.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "member",
                    description: "Select a member to whom the warning belongs to.",
                    type: "USER",
                    required: true
                },
                {
                    name: "warning-id",
                    description: "Provide the id of the warning you want to remove.",
                    type: "NUMBER",
                    required: true
                },
            ]
        },
    ],
    /**
     * @param {Client} client 1
     * @param {CommandInteraction} interaction 
     */
    execute(client, interaction) {
        const { guild, member, options } = interaction;

        const Sub = options.getSubcommand(["add", "remove"]);
        const Target = options.getMember("member");
        const Reason = options.getString("reason");
        const WarnID = options.getNumber("warning-id") - 1;

        const Response = new MessageEmbed()
        .setColor(LyxPurp)
        .setAuthor("WARNING SYSTEM", guild.iconURL({dynamic: true}))

        switch(Sub) {
            case "add": {
                db.findOne({ GuildID: guild.id, UserID: Target.id }, async (err, data) => {
                    if(err) throw err;
                    if(!data || !data.WarnData) {
                        data = new db({
                            GuildID: guild.id,
                            UserID: Target.id,
                            WarnData: [
                                {
                                    ExecuterID: member.id,
                                    ExecuterTag: member.user.tag,
                                    TargetID: Target.id,
                                    TargetTag: Target.user.tag,
                                    Reason: Reason,
                                    Date: parseInt(interaction.createdTimestamp / 1000)
                                }
                            ],
                        })
                    } else {
                        const obj = {
                            ExecuterID: member.id,
                            ExecuterTag: member.user.tag,
                            TargetID: Target.id,
                            TargetTag: Target.user.tag,
                            Reason: Reason,
                            Date: parseInt(interaction.createdTimestamp / 1000)
                        }
                        data.WarnData.push(obj)  
                    }
                    data.save()
                    Response.setDescription(`Member: ${Target} **|** \`${Target.id}\` has been issued a warning\nStaff: ${member} **|** \`${member.id}\`\nReason: \`${Reason}\``);
                    interaction.reply({embeds: [Response]});   

                    Target.send({embeds: [new MessageEmbed().setColor(LyxPurp).setAuthor("WARNING SYSTEM", guild.iconURL({dynamic: true})).setDescription(`You have been warned in **${guild.name}** by ${member}\nReason:\`${Reason}\``)]})
                    .catch(( ) => {console.log(`Could not send the warning notice to ${Target.user.tag}`)})
                });
            }
            break;
            case "remove": {
                db.findOne({ GuildID: guild.id, UserID: Target.id }, async (err, data) => {
                    if(err) throw err;
                    if(data) {           
                        if(data.WarnData.length === 0 ) {
                            Response.setDescription(`Member: \`${Target}\` **|** \`${Target.id}\`\nHas no warning to remove.`)
                            return interaction.reply({embeds: [Response]});
                        }
                        data.WarnData.splice(WarnID, 1);
    
                        Response.setDescription(`Member: ${Target} **|** \`${Target.id}\`\nStaff: ${member} **|** \`${member.id}\`\n
                        Warning ID: \`${WarnID + 1}\` has been removed.`)
                        interaction.reply({embeds: [Response]})

                        guild.channels.cache.get(InfractionsLogs).send({embeds: [Response]})
                        data.save()
                    } else {
                        Response.setDescription(`Member: \`${Target}\` **|** \`${Target.id}\`\nHas no warning to remove.`)
                        return interaction.reply({embeds: [Response]});
                    };
                });
            }
            break;
            default: console.log("An error occured in the warning system.")
        }
    }
};