module.exports = {
    name: "interactionCreate",

    async run(client, interaction) {
        if (!interaction.inGuild()) return;
        if (!interaction.isCommand()) return;
        const guildManager = client.managers.guildManager.getOrCreate(
            interaction.guildId
        );
        const command = client.commands.get(interaction.commandName);
        if (
            command.userPermissions &&
            !interaction.member.permissions.has(command.userPermissions)
        )
            return interaction.reply({
                content:
                    "Vous n'avez pas les permissions nécaissaire pour utiliser cette commande",
                ephemeral: true,
            });
        if (command.guildCrown && interaction.user.id !== interaction.guild.ownerId)
            return interaction.reply({
                content:
                    "Vous n'avez pas les permissions nécaissaire pour utiliser cette commande",
                ephemeral: true,
            });
        if (
            command.owner &&
            !client.util.isOwner(interaction.guild, interaction.user.id)
        )
            return interaction.reply({
                content:
                    "Vous n'avez pas les permissions nécaissaire pour utiliser cette commande",
                ephemeral: true,
            });
        interaction.user.manager =
            client.managers.userManager.getOrCreate(interaction.user.id);
        command.run(client, interaction, guildManager);
    },
};
