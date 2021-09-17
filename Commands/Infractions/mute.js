const { CommandInteraction, MessageEmbed } = require("discord.js");
const { InfractionsLogs, LyxPurp, MutedRole } = require('../../configuration.json');
const db = require('../../Models/infractionsData');
const ms = require('ms');

module.exports = {
    name: "mute",
    description: "Mutes the target for a specified duration.",
    perms: "MUTE_MEMBERS",
    options: [
        {
            name: "member",
            description: "Select a member.",
            type: "USER",
            required: true
        },
        {
            name: "reason",
            description: "Provide a reason.",
            type: "STRING",
            required: true
        },
        {
            name: "duration",
            description: "Select the duration of this mute (1s/1m/1h/1d)",
            type: "STRING",
            required: true
        },
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        const { guild, member, options, reply } = interaction; // Grabs the specified objects from the interaction object.

        const Mute = guild.roles.cache.get(MutedRole)
        const Target = options.getMember("member"); // Gets the target member object.
        const Reason = options.getString("reason"); // Gets the reason string.
        const Duration = options.getString("duration") // Gets the duration for the mute.

        // Creates the mutli-use embed.
        const Response = new MessageEmbed()
        .setColor(LyxPurp)
        .setAuthor("MUTE SYSTEM", guild.iconURL())

        // Checks if the target member is the same as the command executer.
        if(Target.id === member.id) {
            Response.setDescription("⛔ You cannot mute yourself")
            return interaction.reply({embeds: [Response]});
        }

        // Checks if one of the target roles are higher than the command executer's.
        if(Target.roles.highest.position > member.roles.highest.position) {
            Response.setDescription("⛔ You cannot mute someone with a superior role.")
            return interaction.reply({embeds: [Response]});
        }

        // Checks if the target member has the MUTE_MEMBERS permission and declare them as a staff member.
        if(Target.permissions.has(this.perms)) {
            Response.setDescription(`⛔ You cannot mute someone with the \`${this.perms}\` permission.`)
            return interaction.reply({embeds: [Response]});
        }

        // Checks if the duration of the mute is greater than what can be stored.
        if (Duration > 1209600000) {
            Response.setDescription(`⛔ Please enter a length of time of 14 days or less (1s/1m/1h/1d).`)
            return interaction.reply({embeds: [Response]});
        }

        // Checks if the mute doesn't exist.
        if(!Mute) {
            Response.setDescription(`⛔ Muted role is not found.`)
            return interaction.reply({embeds: [Response]});
        }

        // Stores the mute data in the data base.
        db.findOne({ GuildID: guild.id, UserID: Target.id }, async (err, data) => {
            if(err) throw err;
            if(!data) {
                data = new db({
                    GuildID: guild.id,
                    UserID: Target.id,
                    MuteData: [
                        {
                        ExecuterID: member.id,
                        ExecuterTag: member.user.tag,
                        TargetID: Target.id,
                        TargetTag: Target.user.tag,
                        Reason: Reason,
                        Duration: Duration,
                        Date: parseInt(interaction.createdTimestamp / 1000)
                        }
                    ],
                })
            } else {
                const MuteDataObject = {
                    ExecuterID: member.id,
                    ExecuterTag: member.user.tag,
                    TargetID: Target.id,
                    TargetTag: Target.user.tag,
                    Reason: Reason,
                    Duration: Duration,
                    Date: parseInt(interaction.createdTimestamp / 1000)
                }
                data.MuteData.push(MuteDataObject)
            }
            data.save()
        });

        // Sends the ban notice to the member
        Target.send({embeds: [new MessageEmbed().setColor(LyxPurp).setAuthor("MUTE MASTER", guild.iconURL()).setDescription(`You have been muted from **${guild.name}** for: \`${Reason}\`\nDuration: \`${Duration}\``)]})
        .catch(( ) => { console.log(`The client could not send the ban notice to ${Target.user.tag}.`)});

        // Mute the target member.
        await Target.roles.add(Mute.id)
        setTimeout(async () => {
            if(!Target.roles.cache.has(Mute.id)) return;
            await Target.roles.remove(Mute)
        }, ms(Duration))

        // Replies to the interaction with the mute notice.
        Response.setDescription(`Member: ${Target} **|** \`${Target.id}\` has been **muted**\nStaff: ${member} **|** \`${member.id}\`\nReason: \`${Reason}\`\nDuration: \`${Duration}\``)
        interaction.reply({embeds: [Response]});

        // Sends the mute notice to the interaction-logs channel and to the main welcome channel.
        guild.channels.cache.get(InfractionsLogs).send({embeds: [Response]})
    }
}