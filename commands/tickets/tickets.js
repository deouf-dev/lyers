const {ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder} = require("discord.js")
const {RoleSelectMenuBuilder} = require("@discordjs/builders")

module.exports = {
    name: "tickets",
    description: "Commandes tickets",
    options: [
        {name: "panel", description: "Panel pour crée un système de ticket", type: 1},
    ],
    userPermissions: ["Administrator"],

    async run(client, interaction, guildData){
        const cmd = interaction.options.getSubcommand();
        if(cmd === "panel"){
            let config = {
                channel: interaction.channel.id,
                managers: []
            };
            const menu = new ActionRowBuilder().setComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("menu-panel-ticket")
                    .setPlaceholder("lYers 📘")
                    .setOptions(
                        {
                            label: "Salon",
                            emoji: {id: client.util.getEmojiId(client.botemojis.channel)},
                            description: "Modifier le salon du système de ticket",
                            value: "channel"
                        },
                        {
                            label: "Rôles Managers",
                            emoji: {id: client.util.getEmojiId(client.botemojis.role)},
                            description: "Modifier les rôles managers",
                            value: "managers"
                        },
                        {label: "Sauvegarder", description: "Sauvegarder et crée le système de tickets", emoji: {name: "✅"}, value: "save"}
                    )
            )
            const message = await interaction.reply({embeds: [embed()], components: [menu], fetchReply: true});
            const collector = interaction.channel.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id && i.message.id === message.id,
            })
            collector.on("collect", async(collected) => {
                const value = collected.values[0];
                if(value === "channel"){
                    collected.reply({content: "Quel est le salon pour le système de tickets ?", fetchReply: true})
                    interaction.channel.createMessageCollector({filter: (m) => m.author.id === interaction.user.id, max: 1})
                        .on("collect", async(response) => {
                            const channel = client.util.getChannel(response, response.content);
                            if(!channel || channel.type !== 0){
                                return response.reply({content: "Salon invalide"}).then((m) => {
                                    setTimeout(() => {
                                        m.delete();
                                        collected.deleteReply();
                                        response.reply();
                                    }, 3000)
                                })
                            }
                            config.channel = channel.id;
                            collected.deleteReply();
                            response.delete();
                            update();
                        })
                }else if(value === "managers"){
                    const row = new ActionRowBuilder().setComponents(
                        new RoleSelectMenuBuilder()
                            .setPlaceholder("lYers 📘")
                            .setCustomId("managers-menu")
                    )
                    const button = new ActionRowBuilder().setComponents(
                        new ButtonBuilder({emoji: {name: "✅"}, style: 3, custom_id: "ok"})
                    )
                    const reply = await collected.reply({content: "Veuillez choisir un ou plusieurs rôle(s)\n*✅ pour confimer les rôles*", components: [row, button], fetchReply: true})
                    const roles = [];
                    interaction.channel.createMessageComponentCollector({
                        filter: (i) => i.user.id === interaction.user.id && i.message.id === reply.id,
                    }).on("collect", async(response) => {
                        const v = response.customId;
                        if(v === "managers-menu"){
                            const role = response.roles.first();
                            if(role.managed) return response.reply({content: "Rôle invalide", ephemeral: true});
                            response.deferUpdate();
                            roles.push(role.id);
                            response.message.edit({content: `Veuillez choisir un ou plusieurs rôle(s)\n*✅ pour confimer les rôles*\n${roles.map((role) => `<@&${role}>`).join(" ,") ||""}`, components: [row, button], fetchReply: true})
                        }else if(v === "ok"){
                            config.managers = roles;
                            collected.deleteReply();
                            update();
                        }
                    })
                }else if(value === "save"){
                    const channel = interaction.guild.channels.cache.get(config.channel);
                    let embed = {
                        title: "Ticket",
                        description: `Appuyer sur le bouton 🎫 ci-dessous pour crée un ticket`,
                        color: guildData.get("color")
                    }
                    const button = new ActionRowBuilder()
                        .setComponents(
                            new ButtonBuilder({custom_id: "ticket-create", emoji: {name: "🎫"}, style: 2})
                        )
                    channel.send({embeds: [embed], components: [button]}).then((m) => {
                        interaction.editReply({content: `[système de ticket](https://discord.com/channels/${interaction.guild.id}/${channel.id}/${m.id}) crée`, components: [], embeds: []})
                        config.message = m.id;
                        guildData.push("tickets", config);
                    }).catch((e) => {
                        collected.reply({content: "Une erreur est survenue lors de l'envoie du message", ephemeral: true})
                    })
                }

            })
            function update(){
                interaction.editReply({embeds: [embed()]})
            }
            function embed(){
                return {
                    title: "Ticket Panel",
                    description: "*Rôles Manager: rôles ayant accès aux tickets*",
                    fields: [
                        {name: `${client.botemojis.channel} Salon`, value: `> ${config.channel ? `<#${config.channel}>` : "Indéfini"}`, inline: true},
                        {name: `${client.botemojis.role} Rôles Manager`, value: `> ${config.managers.map((id) => `<@&${id}>`).join(" ,") || "Aucun"}`, inline: true}
                    ],
                    color: guildData.get("color")
                }
            }
        }else if(cmd === "manage"){
            const tickets = guildData.get("tickets");
            const message = await home();
            const collector = new interaction.channel.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id && i.message.id === message.id
            })
            collector.on("collect", async(collected) => {
                const value = collected.values[0] || collected.customId;
                if(value === "home_edit"){
                    collected.reply({content: "Quel est le numéro du système de ticket ?", fetchReply: true})
                    interaction.channel.createMessageCollector({
                        filter: (m) => m.author.id === interaction.user.id,
                        max: 1
                    }).on("collect", async(response) => {
                        const ticket = tickets[response.content];
                        if(!ticket) return response.reply("Ticket invalide").then((m) => setTimeout(() => (m.delete(), collected.deleteReply(), response.delete()), 3000));

                    })
                }
            })
            async function home(collected = interaction){
                let embed = {
                    title: "Tickets",
                    description: tickets.map((t, i) => `${i}: [${interaction.guild.channels.cache.get(t.channel)?.name ||"Salon supprimé"}](https://discord.com/channels/${interaction.guild.id}/${t.channel}/${t.message}`) || "Utiliser la commande `/tickets Panel` pour crée votre premier système de tickets",
                    color: guildData.get("color")
                }
                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder({label: "Modifier un système", custom_id: "home_edit", style: 2})
                )
                if(tickets.length === 0) return await interaction.reply({embeds: [embed]});
                else return await interaction.reply({embeds: [embed], components: [button]})
            }
        }
    }
}