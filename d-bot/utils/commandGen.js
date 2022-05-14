let generate = (command, desc, category, option_type, option_name, isRequired, action) => {
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
                    .addStringOption(option => option.setName('${option_name[index]}').setDescription('Put the wanted ${option_name[index]}').setRequired(${isRequired[index]})),
                `;
            } else if (option_type[index] === 'user') {
                commandJs += `
                    .addUserOption(option => option.setName('${option_name[index]}').setDescription('Put the wanted ${option_name[index]}').setRequired(${isRequired[index]})),
                `;
            } else if (option_type[index] === 'channel') {
                commandJs += `
                    .addChannelOption(option => option.setName('${option_name[index]}').setDescription('Put the wanted ${option_name[index]}').setRequired(${isRequired[index]})),
                `;
            } else if (option_type[index] === 'role') {
                commandJs += `
                    .addRoleOption(option => option.setName('${option_name[index]}').setDescription('Put the wanted ${option_name[index]}').setRequired(${isRequired[index]})),
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
                    let user = interaction.options.getUser('${option_name[index]}');
                    interaction.reply({ content: user.username });
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
        let commandJs = `
        const { SlashCommandBuilder } = require('@discordjs/builders');

        module.exports = {
            data: new SlashCommandBuilder()
                .setName('${command}')
                .setDescription('${desc}')
        `;

        if (option_type === 'string') {
            commandJs += `
                .addStringOption(option => option.setName('${option_name}').setDescription('Put the wanted ${option_name}').setRequired(${isRequired})),
            `;
        } else if (option_type === 'user') {
            commandJs += `
                .addUserOption(option => option.setName('${option_name}').setDescription('Put the wanted ${option_name}').setRequired(${isRequired})),
            `;
        } else if (option_type === 'channel') {
            commandJs += `
                .addChannelOption(option => option.setName('${option_name}').setDescription('Put the wanted ${option_name}').setRequired(${isRequired})),
            `;
        } else if (option_type === 'role') {
            commandJs += `
                .addRoleOption(option => option.setName('${option_name}').setDescription('Put the wanted ${option_name}').setRequired(${isRequired})),
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