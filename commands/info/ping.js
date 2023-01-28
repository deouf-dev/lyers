module.exports = {
    name: "ping",
    description: "Afficher la latence du bot en ms",

    async run(client, interaction, guildData){
        interaction.reply({embeds: [
                {
                    fields: [
                        {name: "Ping",value: `\`${client.ws.ping}\``},
                    ],
                    color: guildData.get("color")
                }
            ], ephemeral: true})
    }
}