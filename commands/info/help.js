const Discord = require("discord.js")

module.exports = {
    name: "help",
    description: "Aides aux commandes du bot",
    options: [
        { name: "commande", description: "Informations sur une commande", type: 3 },
    ],

    async run(client, interaction, guildData) {
        const cmdstr = interaction.options
            .getString("commande")
            ?.trim()
            ?.toLowerCase();
        if (cmdstr) {
            const command =
                client.commands.get(cmdstr) ||
                client.commands.find((cmd) => cmd.name.includes(cmdstr));
            if (!command)
                return interaction.reply({
                    content: `Aucune commande trouvées pour \`${cmdstr}\``,
                });
            const embed = {
                title: `Help: ${command.name}`,
                fields: [
                    { name: `\`/\` Nom:`, value: `> \`${command.name}\`` },
                    {
                        name: `\`📝\` Description:`,
                        value: `> \`${command.description}\``,
                    },
                    {
                        name: `\`/\` Sous-Commandes:`,
                        value:
                            command.options
                                .filter((o) => o.type === 1)
                                .map((v) => `\`${v.name}\`\n> ${v.description}`)
                                .join("\n") || "Aucune",
                    },
                ],
                color: guildData.get("color"),
            };
            interaction.reply({ embeds: [embed] });
        } else {
            let fields = {
                owner: {
                    name: `${client.botemojis.owner} Owner`,
                    value: [],
                },
                admin: {
                    name: `${client.botemojis.admin} Administrateur`,
                    value: []
                },
                protection: {
                    name: `${client.botemojis.shield} Protection`,
                    value: [],
                },
                mod: {
                    name: `${client.botemojis.mod} Modération`,
                    value: []
                },
                misc: {
                    name: `${client.botemojis.setup} Misc`,
                    value: [],
                },
                info: {
                    name: `${client.botemojis.user} Informations`,
                    value: [],
                },
                xp: {
                    name: `${client.botemojis.xp} Xp`,
                    value: []
                },
                invites: {
                    name: `📩 Invites`,
                    value: []
                },
                bump: {
                    name: `${client.botemojis.channel} Bump`,
                    value: [],
                },
                tickets: {
                    name: `:tickets: Tickets`,
                    value: []
                },
                backup: {
                    name: "♻ Backup",
                    value: []
                }
            };
            client.commands.forEach((cmd) => {
                if (cmd.options?.find((o) => o.type === 1)) {
                    cmd.options
                        ?.filter((o) => o.type === 1 || o.type === 2)
                        .forEach((option) => {
                            if (option.type === 1)
                                fields[cmd.category]?.value.push(
                                    `*[${cmd.name} ${option.name}](${process.env.SUPPORT})*`
                                );
                            else if (option.type === 2)
                                option.options.forEach((sub) => {
                                    fields[cmd.category]?.value.push(
                                        `*[${cmd.name} ${option.name} ${sub.name}](${process.env.SUPPORT})*`
                                    );
                                });
                        });
                } else {
                    fields[cmd.category]?.value.push(
                        `*[${cmd.name}](${process.env.SUPPORT})*`
                    );
                }
            });
            const fieldsArray = [];
            for (const key in fields) {
                fieldsArray.push({
                    name: fields[key].name,
                    value: "> " + fields[key].value.join(" | "),
                });
            }
            const embed = {
                fields: fieldsArray,
                color: guildData.get("color"),
            };
            const row = new Discord.ActionRowBuilder().setComponents(
                new Discord.ButtonBuilder()
                    .setLabel("lYers")
                    .setEmoji({ name: "📚" })
                    .setStyle("Link")
                    .setURL(
                        "https://discord.com/api/oauth2/authorize?client_id=1058745124588376105&permissions=8&scope=bot%20applications.commands"
                    ),
                new Discord.ButtonBuilder()
                    .setLabel("Support")
                    .setEmoji({
                        id: client.util.getEmojiId(client.botemojis.support),
                    })
                    .setStyle("Link")
                    .setURL(process.env.SUPPORT)
            );
            interaction.reply({ embeds: [embed], components: [row] });
        }
    },
};
