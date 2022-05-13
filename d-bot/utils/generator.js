const fs = require('fs');
const JSZip = require('jszip');
//generate files for a discord bot

function generate(bot_name, commands, desc, return_msg, category) {
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

    // generate bot.js
    let botJs = `const { Client, Intents, Collection } = require('discord.js');
    const fs = require('fs');
    const client = new Client({ disableMentions: 'everyone', intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS] });

    client.commands = new Collection();
    const config = require('../config.json');

    if (!config.token) console.log('No token provided! Please put your token is config.json');

    const functions = fs.readdirSync('./src/functions/').filter(file => file.endsWith('.js'));
    const eventsFiles = fs.readdirSync('./src/events/').filter(file => file.endsWith('.js'));
    const commandFolders = fs.readdirSync('./src/commands');

    (async () => {
        for (file of functions) {
            require(\`./functions/\${file}\`)(client);
        }

        client.handleEvents(eventsFiles, "./src/events");
        client.handleCommands(commandFolders, "./src/commands");
        client.login(config.token);
    })()`;

    // generate config.json
    let configJson = `{
        "token": "",
        "prefix": "!",
        "guildId": "",
        "clientId": ""
    }`;

    // generate fonctions/handleCommands.js
    let handleCommands = `
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord-api-types/v9');
    const fs = require('fs');
    const config = require('../../config.json');

    const guildId = config.guildId;
    const clientId = config.clientId;

    if (!guildId) console.log('No guildId provided! Please put your guildId in config.json');
    if (!clientId) console.log('No clientId provided! Please put your clientId in config.json');

    module.exports = (client) => {
        client.handleCommands = (commandFolder, path) => {
            client.commandArray = [];
            for (folder of commandFolder) {
                const commands = fs.readdirSync(\`\${path}/\${folder}\`).filter(file => file.endsWith('.js'));
                for (file of commands) {
                    const command = require(\`../commands/\${folder}/\${file}\`);
                    client.commands.set(command.data.name, command);
                    client.commandArray.push(command.data.toJSON());
                }
            }
            const rest = new REST({ version: '9' }).setToken(config.token);

            (async () => {
                try {
                    console.log('Started registering commands...');

                    await rest.put(
                        Routes.applicationGuildCommands(clientId, guildId), {
                            body: client.commandArray
                        },
                    );

                    console.log('Registered commands!');
                } catch (e) {
                    console.log('Error registering commands! ' + e);
                }
            })();
        }
    }`;

    // generate functions/handleEvents.js
    let handleEvents = `
    module.exports = (client) => {
        client.handleEvents = async(eventsFiles, path) => {
            for (const file of eventsFiles) {
                const event = require('../events/' + file);
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
            }
        }
    }`;

    let onReady = `
    module.exports = {
        name: 'ready',
        once: true,
        async execute(client) {
            console.log('Bot is ready as \${client.user.tag}!');
        }
    }`;

    // generate interaction create
    let interactionCreate = `
    module.exports = {
        name: 'interactionCreate',
        async execute(interaction, client) {
            if (!interaction.isCommand()) return;

            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (e) {
                console.log(e);
                await interaction.reply({ content: 'An error occured while executing this command!', ephemeral: true });
            }
        }
    }`;



    let commandList = [];

    //if commands is an array
    if (Array.isArray(commands)) {
        commands.forEach(command => {
            //generate commands/[command].js
            let commandJs = `
            const { SlashCommandBuilder } = require('@discordjs/builders');

            module.exports = {
                data: new SlashCommandBuilder()
                    .setName('${command.command}')
                    .setDescription('${command.description}'),
                async execute(interaction) {
                    await interaction.reply('${command.return}');
                }
            }
            `
            commandList.push([commandJs, command.command]);
        });
    } else {
        let commandJs = `
            const { SlashCommandBuilder } = require('@discordjs/builders');

            module.exports = {
                data: new SlashCommandBuilder()
                    .setName('${commands}')
                    .setDescription('${desc}'),
                async execute(interaction) {
                    await interaction.reply('${return_msg}');
                }
            }
            `
            commandList.push([commandJs.trim(), commands]);
    }
        


    // generate zip file
    let zip = new JSZip();
    zip.file('package.json', JSON.stringify(bot_package));
    zip.file('src/bot.js', botJs);
    zip.file('config.json', configJson);
    zip.file('src/functions/handleCommands.js', handleCommands);
    zip.file('src/functions/handleEvents.js', handleEvents);
    zip.file('src/events/ready.js', onReady);
    zip.file('src/events/interactionCreate.js', interactionCreate);
    zip.folder('src/commands');
    zip.folder('src/events');
    commandList.forEach(command => {
        zip.file('src/commands/' + category + "/" + command[1] + '.js', command[0]);
    });
    zip.generateAsync({ type: 'nodebuffer' }).then(function (content) {
        fs.writeFileSync(`../temp/bot-${randomNumber}.zip`, content);
        console.log('Saved!');
    });
}

module.exports = { generate };