module.exports = {
	name: "owner",
	description: "Commandes owner",
	options: [
		{
			name: "add",
			description: "Ajouter un owner",
			type: 1,
			options: [
				{
					name: "membre",
					description: "Le membre à ajouter aux owners",
					type: 6,
					required: true,
				},
			],
		},
		{
			name: "del",
			description: "Supprimer un owner",
			type: 1,
			options: [
				{
					name: "membre",
					description: "Le membre à supprimer des owners",
					type: 6,
					required: true,
				},
			],
		},
		{
			name: "list",
			description: "Lister les owners",
			type: 1,
		},
		{
			name: "clear",
			description: "Supprimer toute la liste des owners",
			type: 1,
		},
	],
	guildCrown: true,
	async run(client, interaction, guildData) {
		const owners = guildData.get("owners");
		const cmd = interaction.options.getSubcommand();
		if (cmd === "add") {
			const user = interaction.options.getUser("membre");
			if (user.id === client.user.id)
				return interaction.reply({
					content: `Vous ne pouvez pas owner le bot`,
					ephemeral: true,
				});
			if (owners.includes(user.id))
				return interaction.reply({
					content: `${user} est déjà owner`,
					ephemeral: true,
				});
			guildData.push("owners", user.id).save();
			interaction.reply({
				content: `${user} est maintenant owner`,
				ephemeral: true,
			});
		} else if (cmd === "del") {
			const user = interaction.options.getUser("membre");
			if (user.id === interaction.guild.ownerId)
				return interaction.reply({
					content: `Vous ne pouvez pas supprimer des owners le propriétaire du serveur`,
					ephemeral: true,
				});
			if (!owners.includes(user.id))
				return interaction.reply({
					content: `${user} n'est pas owner`,
					ephemeral: true,
				});
			guildData.unpush("owners", user.id).save();
			interaction.reply({
				content: `${user} n'est plus owner`,
				ephemeral: true,
			});
		} else if (cmd === "list") {
			interaction.reply({
				embeds: [
					{
						title: "Owners",
						description:
							owners.map((id) => `<@${id}>`).join("\n") || "Aucune données",
						color: guildData.get("color"),
					},
				],
				ephemeral: true,
			});
		} else if (cmd === "clear") {
			guildData.set("owners", []).save();
			interaction.reply({
				content: "Toute la liste des owners a corréctement été éffacée",
				ephemeral: true,
			});
		}
	},
};
