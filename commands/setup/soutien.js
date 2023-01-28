const {ActionRowBuilder, ButtonBuilder} = require("discord.js")

module.exports = {
    name: "soutien",
    description: "Commandes soutien",
    options: [
        {name: "config", description: "Configurer le système de soutien", type: 1},
        {name: "list", description: "Lister toutes les personnes ayant le rôle soutien", type: 1}
    ],
    userPermissions: ["Administrator"],

    async run(client, interaction, guildData){
        const cmd = interaction.options.getSubcommand();
        if(cmd === "config"){
            let config = guildData.get("soutien");

            const message = await interaction.reply({embeds: [embed()], components: [buttons()], fetchReply: true})

            const collector = interaction.channel.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id && i.message.id === message.id,
                time: 300000
            })
            collector.on("collect", async(collected) => {
                const id = collected.customId;
                if(id === "role"){
                    collected.reply({content: "Quel est le rôle soutien ?", fetchReply: true});
                    msgCollector().on("collect", async(response) => {
                        const role = client.util.getRole(response, response.content);
                        if(!role || role.managed) return response.reply("Rôle invalide").then((m) => setTimeout(() => (m.delete(), response.delete(), collected.deleteReply()), 3000))
                        config.role = role.id;
                        update()
                        collected.deleteReply();
                        response.delete()
                    })
                }else if(id === "message"){
                    collected.reply({content: "Quel est le message de soutien ?", fetchReply: true});
                    msgCollector().on("collect", async(response) => {
                        config.message = response.content;
                        update()
                        collected.deleteReply();
                        response.delete()
                    })
                }else if(id === "toggle"){
                    collected.deferUpdate()
                    config.toggle = config.toggle ? false : true;
                    update();
                }
            })


            function msgCollector(){
                return interaction.channel.createMessageCollector({
                    filter: (m) => m.author.id === interaction.user.id,
                    max: 1
                })
            }
            function buttons(){
                return new ActionRowBuilder().setComponents(
                    new ButtonBuilder({label: "Message", style: 1, custom_id: "message"}),
                    new ButtonBuilder({label: "Rôle", style: 1, custom_id: "role"}),
                    new ButtonBuilder({label: config.toggle ? "Désactiver" : "Activer", style: config.toggle ? 4 : 3, custom_id: "toggle"})
                )
            }
            function embed(){
                return {
                    title: "Soutien Config",
                    fields: [
                        {name: `${client.botemojis.channel} Message de soutien`, value: `> \`${config.message || "Indéfini"}\``, inline: true},
                        {name: `${client.botemojis.role} Rôle de soutien`, value: `> ${config.role ? `<@&${config.role}>` : "Indéfini"}`, inline: true},
                        {name: `Status`, value: `> ${config.toggle ? client.botemojis.on : client.botemojis.off}`, inline: true}
                    ],
                    color: guildData.get("color")
            }
            }
            function update(){
                guildData.set("soutien", config);
                interaction.editReply({embeds: [embed()]})
            }
        }else if(cmd === "list"){
            const config = guildData.get("soutien");
            if(!config.role) return interaction.reply({content: "Le rôle soutien n'a pas été défini, pour le définir utiliser la commande /soutien config", ephemeral: true})
            const members = interaction.guild.members.cache.filter((m) => m.roles.cache.has(config.role));
            
            let embed = {
                title: "Soutien",
                description: members.map((m)=> `${m}`).join("\n") || "Aucun",
                color: guildData.get("color")
            }
            interaction.reply({embeds: [embed], ephemeral: true})
        }
    }
}