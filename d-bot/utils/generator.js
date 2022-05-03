const fs = require('fs');
//generate files for a discord bot

function generate(bot_name, commands) {
    let randomNumber = Math.floor(Math.random() * 1000000000000);
    let formattedName = bot_name.replace(" ", '_');
    let bot_package = {
        "name": formattedName.toLowerCase(),
        "version": "1.0.0",
        "description": "A discord bot made with discord.js & d-bot",
        "main": "app.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "author": "d-bot generator",
        "license": "ISC",
        "dependencies": {
            "@discordjs/builders": "^0.8.2",
            "@discordjs/rest": "^0.1.0-canary.0",
            "discord-api-types": "^0.24.0",
            "discord.js": "^13.6.0",
            "mysql": "^2.18.1",
            "ms": "^2.1.3",
        }
    };
    let dir = `../temp/bot-${randomNumber}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    let botFile = JSON.stringify(bot_package, null, 2);
    let botFilePath = `../temp/bot-${randomNumber}/package.json`;
    fs.writeFile(botFilePath, botFile, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    // generate bot.js
    let botJs = `const { Client, Intents, Collection } = require('discord.js');
    const fs = require('fs');
    const client = new Client({ disableMentions: 'everyone', intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS] });

    client.commands = new Collection();
    const config = require('./config.json');

    if (!config.token) return console.log('No token provided! Please put your token is config.json');

    const functions = fs.readdirSync('./src/functions/').filter(file => file.endsWith('.js'));
    const eventsFiles = fs.readdirSync('./src/events/').filter(file => file.endsWith('.js'));
    const commandsFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));

    (async () => {
        for (file of functions) {
            require(\`./functions/\${file}\`)(client);
        }

        client.handleEvents(eventsFiles, "./src/events");
        client.handleCommands(commandsFiles, "./src/commands");
        client.login(config.token);
    })()`;
    let botJsPath = `../temp/bot-${randomNumber}/bot.js`;
    fs.writeFile(botJsPath, botJs, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    // generate config.json
    let configJson = `{
        "token": "",
        "prefix": "!"
    }`;
    let configJsonPath = `../temp/bot-${randomNumber}/config.json`;
    fs.writeFile(configJsonPath, configJson, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    // generate fonctions/handleCommands.js
    let handleCommands = `
    
    `
}

module.exports = { generate };