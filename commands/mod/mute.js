module.exports = {
    name: "mute",
    description: "Rendre muet un membre",
    userPermissions: ["ManageMessages"],
    options: [
        {name: "membre", description: "Le membre", required: true, type: 6},
        {name: "raison", description: "La raison", required: false, type: 3},
        {name: "durée", description: "La durée (sinon définitif)", required: false, type: 3},
    ],
    async run(client, interaction, guildData){
        const target = interaction.guild.members.cache.get(interaction.options.getUser("membre").id);
        if(!target) return interaction.reply({content: "Membre introuvable", ephemeral: true});
        const muterole = guildData.get("muterole");
        if(!muterole) return interaction.reply({content: "Muterole indéfini, utiliser la commande /muterole pour le définir", ephemeral: true});
        const reason = interaction.options.getString("raison") || "Aucune raison";
        const duration = interaction.options.getString("durée")
        if(duration && !client.util.checkDuration(duration)) return interaction.reply({content: "Durée invalide", ephemeral: true})
        if(target.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: "Vous ne pouvez pas mute cette utilisateur car il possède un plusieurs rôle au-dessus de vous", ephemeral: true})
        target.roles.add(muterole).then(() => {
            interaction.reply(`${target} a été mute pour ${reason} ${duration ? `pendant ${duration}`: ""}`);
            client.util.modLog(interaction.guild, `${interaction.user} a mute ${target} pour ${reason} ${duration ? `pendant ${duration}`: ""}`)
            if(duration){
                const data = {guildId: interaction.guildId, muterole, expireAt: Date.now() + require("ms")(duration)}
                client.managers.muteManager.getOrCreate(target.user.id).push("mutes", data);
                setTimeout(() => {
                    target.roles.remove(muterole).catch((e) =>{});
                    client.managers.muteManager.getOrCreate(target.user.id).unpush("mutes", data)
                }, require("ms")(duration))
            }
        }).catch((e) => {
            interaction.reply({content: "Une erreur est survenue lors du mute", ephemeral: true})
        })
    }
}