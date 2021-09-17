const { Client } = require("discord.js");
const { glob } = require('glob');
const { promisify } = require('util');
const PG = promisify(glob);

/**
 * @param {Client} client 
 */
module.exports = async (client) => {

    commandsArry = [];

    (await PG(`${process.cwd()}/Commands/*/*.js`)).map(async(file) => {
        const command = require(file);

        if(!command.name) return;

        if(command.permission && !Permissions.includes(command.permission)) {

            return console.log(`❌ Command Permission Is Invalid: ${command.name}`);

        } else if(command.permission && Permissions.includes(command.permission)) {
            
            command.defaultPermission = false;
        }

        commandsArry.push(command);
        client.commands.set(command.name, command);

        console.log(`🔶 Command Loaded ` + command.name);
    });

    client.on("ready", async ()  => {
        const MainGuild = await client.guilds.cache.get("649379388110012445");

        MainGuild.commands.set(commandsArry).then((command) => {
            const Roles = (commandName) => {
                const cmdPerms = commandsArry.find((c) => c.name === commandName).perms;

                if(!cmdPerms) return null;

                return MainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms) && !r.managed);  
            };

            const fullPermissions = command.reduce((ac, x) => {
                const roles = Roles(x.name);
                if (!roles) return ac;

                const permissions = roles.reduce((a, v) => {
                    return [ ...a, {id: v.id, type: "ROLE", permission: true}];
                }, []);

                return [...ac, {id: x.id, permissions}];
            }, []);

            MainGuild.commands.permissions.set({ fullPermissions });
        });
    });
};