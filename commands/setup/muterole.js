module.exports = {
    name: "muterole",
    description: "Modifier le muterole",
    options: [
        {name: "define", description: "Définir le muterole", type: 1, options:[{name: "role", description: "Le muterole", type: 8, required: true}]},
        {name: "create", description: "Créer le muterole", type: 1}
    ],
    userPermissions: ["Administrator"],

    async run(client, interaction, guildData){
        const cmd = interaction.options.getSubcommand();
        if(cmd === "define"){
            const muterole = interaction.options.getRole("role")?.id;
            if(muterole.managed) return interaction.reply({content: "Rôle invalide", ephemeral: true})
            guildData.set("muterole", muterole)
            interaction.reply({content: `Le nouveau muterole est <@&${muterole}>`, ephemeral: true})
        }else if(cmd === "create"){
            interaction.guild.roles.create({
                name: "muted",
            }).then((muterole) => {
                interaction.guild.channels.cache.forEach((channel) => {
                    channel.permissionOverwrites.edit(muterole, {SendMessages: false, Connect: false})
                })
                interaction.reply({content: `Muterole crée: ${muterole}`, ephemeral: true})
                guildData.set("muterole", muterole.id)
            }).catch((e) => {
                console.log(e)
                interaction.reply({content: `Je n'ai pas pu crée le muterole`, ephemeral: true})
            })
        }
    }
}