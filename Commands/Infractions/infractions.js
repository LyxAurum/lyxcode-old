const { CommandInteraction, MessageEmbed } = require('discord.js');
const db = require("../../Models/infractionsData");

module.exports = {
    name: "infractions",
    description: "Infraction system",
    perms: "ADMINISTRATOR",
    options: [
        {
            name: "member",
            description: "Select member",
            type: "USER",
            required: true
        },
        {
            name: "check",
            description: "Select a specific type of infraction to check.",
            type: "STRING",
            required: true,
            choices: [
                {
                    name: "ALL",
                    value: "all"
                },
                {
                    name: "WARNINGS",
                    value: "warnings"
                },
                {
                    name: "BANS",
                    value: "bans"
                },
                {
                    name: "KICKS",
                    value: "kicks"
                },
                {
                    name: "MUTES",
                    value: "mutes"
                },
                {
                    name: "REPORTS",
                    value: "reports"
                },
            ]
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const { guild, member, options} = interaction;

        const Target = options.getMember("member");
        const choice = options.getString("check");

        const Response = new MessageEmbed()
        .setColor("RED")
        .setAuthor("INFRACTION SYSTEM", guild.iconURL({dynamic: true}))

        switch(choice) {
            case "all" : {
                db.findOne({GuildID: guild.id, UserID: Target.id}, async (err, data) => {
                    if(err) throw err;
                    if(data) {
                        const W = data.WarnData.length;
                        const R = data.ReportData.length;
                        const B = data.BanData.length;
                        const K = data.KickData.length;
                        const M = data.MuteData.length;

                        Response.setDescription(`Member: ${Target} | ${Target.id}\n
                        Warnings: ${W}\nReports: ${R}\nBans: ${B}\nKicks: ${K}\nMutes: ${M}`)
                        interaction.reply({embeds: [Response]})
                    } else {
                        Response.setDescription(`${Target} has no infractions.`)
                        interaction.reply({embeds: [Response]})
                    }
                })
            }
            break;
            case "warnings" : {
                db.findOne({GuildID: guild.id, UserID: Target.id}, async (err, data) => {
                    if(err) throw err;
                    if(data) {
                        if(data.WarnData.length < 1) {
                            Response.setDescription(`${Target} has no warnings.`)
                            interaction.reply({embeds: [Response]})
                        }
                        Response.setDescription(`${Target} | ${Target.id}'s warnings\n
                        ` + `${data.WarnData.map((w, i) => `ID: ${i +1}, Date: <t:${w.Date}:R>\nStaff: <@${w.ExecuterID}>\nReason: ${w.Reason}
                        \n`).join(" ").slice(0, 4000)}`)
                        interaction.reply({embeds: [Response]})
                    } else {
                        Response.setDescription(`${Target} has no warnings.`)
                        interaction.reply({embeds: [Response]})
                    }
                })
            }
            break;
            case "bans" : {
                db.findOne({GuildID: guild.id, UserID: Target.id}, async (err, data) => {
                    if(err) throw err;
                    if(data) {
                        if(data.BanData.length < 1) {
                            Response.setDescription(`${Target} has no bans.`)
                            interaction.reply({embeds: [Response]})
                        }
                        Response.setDescription(`${Target} | ${Target.id}'s bans\n
                        ` + `${data.BanData.map((w, i) => `ID: ${i +1}, Date: <t:${w.Date}:R>\nStaff: <@${w.ExecuterID}>\nReason: ${w.Reason}\nMessages Delete: ${w.Messages}
                        \n`).join(" ").slice(0, 4000)}`)
                        interaction.reply({embeds: [Response]})
                    } else {
                        Response.setDescription(`${Target} has no bans.`)
                        interaction.reply({embeds: [Response]})
                    }
                })
            }
            break;
            case "kicks" : {
                db.findOne({GuildID: guild.id, UserID: Target.id}, async (err, data) => {
                    if(err) throw err;
                    if(data) {
                        if(data.KickData.length < 1) {
                            Response.setDescription(`${Target} has no kicks.`)
                            interaction.reply({embeds: [Response]})
                        }
                        Response.setDescription(`${Target} | ${Target.id}'s kicks\n
                        ` + `${data.KickData.map((w, i) => `ID: ${i +1}, Date: <t:${w.Date}:R>\nStaff: <@${w.ExecuterID}>\nReason: ${w.Reason}
                        \n`).join(" ").slice(0, 4000)}`)
                        interaction.reply({embeds: [Response]})
                    } else {
                        Response.setDescription(`${Target} has no kicks.`)
                        interaction.reply({embeds: [Response]})
                    }
                })
            }
            break;
            case "mutes" : {
                db.findOne({GuildID: guild.id, UserID: Target.id}, async (err, data) => {
                    if(err) throw err;
                    if(data) {
                        if(data.MuteData.length < 1) {
                            Response.setDescription(`${Target} has no mutes.`)
                            interaction.reply({embeds: [Response]})
                        }
                        Response.setDescription(`${Target} | ${Target.id}'s mutes\n
                        ` + `${data.MuteData.map((w, i) => `ID: ${i +1}, Date: <t:${w.Date}:R>\nStaff: <@${w.ExecuterID}>\nReason: ${w.Reason}\nDuration: ${w.Duration}
                        \n`).join(" ").slice(0, 4000)}`)
                        interaction.reply({embeds: [Response]})
                    } else {
                        Response.setDescription(`${Target} has no mutes.`)
                        interaction.reply({embeds: [Response]})
                    }
                })
            }
        }
    }
}