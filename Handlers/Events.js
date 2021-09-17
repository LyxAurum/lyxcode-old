const { glob } = require('glob');
const { promisify } = require('util');
const globPromise = promisify(glob);

module.exports = async (client) => {
    const eventFiles = await globPromise(`${process.cwd()}/Events/*/*.js`);

    eventFiles.map((file) => {
        const event = require(file);
        if(!event.name) return;

        if(event.once) 
        client.once(event.name, (...args) => event.execute(client, ...args));
        else 
        client.on(event.name, (...args) => event.execute(client, ...args));
        
        const C = file.split("/");
        console.log(`✔ Event Loaded ` + event.name.toUpperCase() + ` From ${C[C.length - 2]}`)
    })
};