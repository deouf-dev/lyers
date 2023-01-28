const Discord = require("discord.js");


module.exports = {
    name: "antiraid",
    description: "Commandes antiraid",
    options: [
        {name: "panel", description: "Panel de l'antiraid", type: 1},
        {name: "help", description: "Explication du système Antiraid", type: 1}
    ],
    owner: true,

    async run(client, interaction, guildData){
        const cmd = interaction.options.getSubcommand();
        const config = guildData.get("antiraid")
        if(cmd === "panel"){
            const message = await interaction.reply({embeds: [embed()], components: [menu()], fetchReply: true});

            const collector = interaction.channel.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id && i.message.id === message.id,
                componentType: 3
            });
            collector.on("collect" ,async(collected) => await show(collected))



            async function show(collected) {
                const key = collected.values[0];
                const togglesButtons = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder({label: "Off", style: 1, customId: "off"}),
                    new Discord.ButtonBuilder({label: "On", style: 3, customId: "on"}),
                    new Discord.ButtonBuilder({label: "Max", style: 4, customId: "max"})

                )
                const reply = await collected.reply({content: `Quel est le nouveau status de l'${key} ?`,components: [togglesButtons], fetchReply: true});
                const button = await collected.channel.awaitMessageComponent({
                    filter: (i) => i.user.id === interaction.user.id && i.message.id === reply.id,
                })
                    button.deferUpdate();
                    let newConfig = {toggle: button.customId, punish: config[key].punish || "derank",}
                    if(!button.isButton() || button.message.id !== reply.id) return;
                    if(newConfig.toggle ===  "off") {
                        collected.editReply({content: `L'${key} a corréctement été désactiver`, components: []})
                        config[key] = newConfig;
                        save();
                        update();
                        collected.deleteReply()
                        return;
                    }

                    const punishButtons = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder({label: "Derank", style: 1, customId: "derank"}),
                        new Discord.ButtonBuilder({label: "Kick", style: 1, customId: "kick"}),
                        new Discord.ButtonBuilder({label: "Ban", style: 1, customId: "ban"})
                    )
                    collected.editReply({content: `Quel est la nouvelle punition de l'${key} ?`, components: [punishButtons]});
                const _button = await collected.channel.awaitMessageComponent({
                    filter: (i) => i.user.id === interaction.user.id && i.message.id === reply.id,
                })
                        newConfig.punish = _button.customId;
                        if(!require("../../structures/managers/guilds/model").antiraid[key].limit) {
                            collected.editReply({content: `L'${key} a corréctement été configurer`, components: []})
                            config[key] = newConfig
                            save();
                            update();
                            setTimeout(() => {
                               collected.deleteReply()
                            }, 2000)
                        }else {
                            collected.editReply({content: `Quel est la nouvelle limite de l'${key} (envoyer un message dans le salon)\nExemple: 3/h`, components: []});
                            const msgC = collected.channel.createMessageCollector({
                                max: 1,
                                filter: (m) => m.author.id === interaction.user.id
                            })
                            msgC.on("collect", async(res) => {
                                const args = res.content.split("/");
                                if(isNaN(args[0]) || args[1] !== "s" && args[1] !== "m" && args[1] !== "h" && args[1] !== "d") {
                                    res.delete();
                                    collected.editReply({content: "Limite invalide\nExemple: 3/h"})
                                    setTimeout(() => {
                                        collected.deleteReply()
                                    }, 2000)
                                }
                                newConfig.limit = res.content;
                                config[key] = newConfig;
                                res.delete();
                                save();
                                update();
                                collected.editReply({content: `L'${key} a corréctement été configurer`, components: []})
                                setTimeout(() => {
                                    collected.deleteReply()
                                }, 2000)
                            })
                        }

            }
            function save(){
                guildData.set("antiraid", {...guildData.get("antiraid"), ...config})
            }
            function update(){
                interaction.editReply({embeds: [embed()], components: [menu()]})
            }
            function embed() {
                let o =  {
                    title: "Panel Antiraid",
                    fields: [],
                    color: guildData.get("color")
                }
                for(const key in require("../../structures/managers/guilds/model").antiraid){
                    let e = client.botemojis.off;
                    config[key] ? null : config[key] = require("../../structures/managers/guilds/model").antiraid[key]
                    if(config[key].toggle === "on") e = client.botemojis.on;
                    if(config[key].toggle === "max") e = client.botemojis.max;
                    o.fields.push({name: key.charAt(0).toUpperCase() + key.slice(1), value: `> ${e} - ${config[key].punish || "derank"} ${config[key].limit ? `- ${config[key].limit} `: ""}`})
                }
                return o;
            }
            function menu() {
                const menu = new Discord.StringSelectMenuBuilder()
                    .setCustomId("menu-antiraid-panel")
                    .setPlaceholder("lYers 📘")
                for(const key in require("../../structures/managers/guilds/model").antiraid){
                    menu.addOptions({label: key.charAt(0).toUpperCase() + key.slice(1), value: key, description: `Configurer l'${key}`})
                }
                return new Discord.ActionRowBuilder().addComponents(menu)
            }
        }
        else if(cmd === "help"){
            let embed = {
                title: "Help Antiraid",
                description: "**__lYers__** possède un système d'antiraid très avancé avec un panel très innovant.\nVoici quelques paramètres à comprendre pour utiliser l'antiraid:\n*off*: Paramètre désactivé\n*on*: Paramètre activé, la whitelist coutourne le paramètre\n*max*: Paramètre activé, uniquement les owners coutournent le paramètre",
                color: guildData.get("color")
            }
            interaction.reply({embeds: [embed], ephemeral: true})
        }
    }
}