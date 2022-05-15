let generate = (command, desc, option_type, option_name, isRequired, action) => {
    res = [];
    //chack if command is an array
    if (command.constructor === Array) {
        for (let index = 0; index < command.length; index++) {
            let commandJs = `
            const { SlashCommandBuilder } = require('@discordjs/builders');

            module.exports = {
                data: new SlashCommandBuilder()
                    .setName('${command[index]}')
                    .setDescription('${desc[index]}')
            `;

            if (option_type[index] === 'string') {
                commandJs += `
                    .addStringOption(option => option.setName('${option_name[index]}').setDescription('Put the wanted ${option_name[index]}').setRequired(${isRequired[index] == 'Required' ? 'true' : 'false'})),
                `;
            } else if (option_type[index] === 'user') {
                commandJs += `
                    .addUserOption(option => option.setName('${option_name[index]}').setDescription('Put the wanted ${option_name[index]}').setRequired(${isRequired[index] == 'Required' ? 'true' : 'false'})),
                `;
            } else if (option_type[index] === 'channel') {
                commandJs += `
                    .addChannelOption(option => option.setName('${option_name[index]}').setDescription('Put the wanted ${option_name[index]}').setRequired(${isRequired[index] == 'Required' ? 'true' : 'false'})),
                `;
            } else if (option_type[index] === 'role') {
                commandJs += `
                    .addRoleOption(option => option.setName('${option_name[index]}').setDescription('Put the wanted ${option_name[index]}').setRequired(${isRequired[index] == 'Required' ? 'true' : 'false'})),
                `;
            }

            commandJs += `
                async execute(interaction, client) {
                `

            if (action[index] === 'upper') {
                commandJs += `
                    let str = interaction.options.getString('${option_name[index]}');
                    str = str.toUpperCase();
                    interaction.reply({ content: str });
                }
            }`;
            } else if (action[index] === 'reverse') {
                commandJs += `
                    let str = interaction.options.getString('${option_name[index]}');
                    str = str.split('').reverse().join('');
                    interaction.reply({ content: str });
                }
            }`;
            } else if (action[index].includes('getUser')) {
                commandJs += `
                    let user = interaction.options.getUser('${option_name[index]}');`;
                    if (action[index].includes('getUserId')) {
                        commandJs += `
                        interaction.reply({ content: user.id });`;
                    } else if (action[index].includes('getUserName')) {
                        commandJs += `
                        interaction.reply({ content: user.username });`;
                    } else if (action[index].includes('getUserDiscriminator')) {
                        commandJs += `
                        interaction.reply({ content: user.discriminator });`;
                    } else if (action[index].includes('getUserAvatarUrl')) {
                        commandJs += `
                        interaction.reply({ content: user.avatarURL({ format: 'png', dynamic: true, size: 256 })});`;
                    } else if (action[index].includes('getUserStatus')) {
                        commandJs += `
                        interaction.reply({ content: user.presence.status });`;
                    } else if (action[index].includes('getUserGame')) {
                        commandJs += `
                        interaction.reply({ content: user.presence.game });`;
                    } else if (action[index].includes('getUserInfos')) {
                        commandJs += `
                        interaction.reply({ content: 'User infos: ' + user.id + ' ' + user.username + ' ' + user.discriminator + ' ' + user.avatarURL({ format: 'png', dynamic: true, size: 256 }) });`;
                    }
                commandJs += `
                }
            }`;
            } else if (action[index].includes('banUser')) {
                commandJs += `
                    let user = interaction.options.getUser('${option_name[index]}');
                    user.ban(user, { reason: 'Banned by the bot' });
                }}`;
            } else if (action[index].includes('kickUser')) {
                commandJs += `
                    let user = interaction.options.getUser('${option_name[index]}');
                    user.kick(user, { reason: 'Kicked by the bot' });
                }}`;
            } else if (action[index] === 'muteUser') {
                commandJs += `
                    let user = interaction.options.getUser('${option_name[index]}');
                    user.addRole(user, 'Muted');
                }
                }`;
            } else if (action[index].includes('getChannel')) {
                commandJs += `
                    let channel = interaction.options.getChannel('${option_name[index]}');
                    interaction.reply({ content: channel.name });
                }
            }`;
            } else if (action[index].includes('getRole')) {
                commandJs += `
                    let role = interaction.options.getRole('${option_name[index]}');
                    interaction.reply({ content: role.name });
                }
            }`;
            }

            res.push([commandJs, command[index]]);
        }

        return res;
    } else {
        console.log(action);
        let commandJs = `
        const { SlashCommandBuilder } = require('@discordjs/builders');

        module.exports = {
            data: new SlashCommandBuilder()
                .setName('${command}')
                .setDescription('${desc}')
        `;

        if (option_type === 'string') {
            commandJs += `
                .addStringOption(option => option.setName('${option_name}').setDescription('Put the wanted ${option_name}').setRequired(${isRequired == 'Required' ? 'true' : 'false'})),
            `;
        } else if (option_type === 'user') {
            commandJs += `
                .addUserOption(option => option.setName('${option_name}').setDescription('Put the wanted ${option_name}').setRequired(${isRequired == 'Required' ? 'true' : 'false'})),
            `;
        } else if (option_type === 'channel') {
            commandJs += `
                .addChannelOption(option => option.setName('${option_name}').setDescription('Put the wanted ${option_name}').setRequired(${isRequired == 'Required' ? 'true' : 'false'})),
            `;
        } else if (option_type === 'role') {
            commandJs += `
                .addRoleOption(option => option.setName('${option_name}').setDescription('Put the wanted ${option_name}').setRequired(${isRequired == 'Required' ? 'true' : 'false'})),
            `;
        }

        commandJs += `
            async execute(interaction, client) {
            `

        if (action === 'upper') {
            commandJs += `
                let str = interaction.options.getString('${option_name}');
                str = str.toUpperCase();
                interaction.reply({ content: str });
            }
        }`;
        } else if (action === 'reverse') {
            commandJs += `
                let str = interaction.options.getString('${option_name}');
                str = str.split('').reverse().join('');
                interaction.reply({ content: str });
            }
        }`;
        } else if (action.includes('getUser')) {
            commandJs += `
                let user = interaction.options.getUser('${option_name}');
                interaction.reply({ content: user.username });
        }
        }`;
        } else if (action.includes('getChannel')) {
            commandJs += `
                let channel = interaction.options.getChannel('${option_name}');
                interaction.reply({ content: channel.name });
            }
        }`;
        } else if (action.includes('getRole')) {
            commandJs += `
                let role = interaction.options.getRole('${option_name}');
                interaction.reply({ content: role.name });
            }
        }`;
        }

        res.push([commandJs, command]);
        return res;
    }
}

module.exports = {generate};