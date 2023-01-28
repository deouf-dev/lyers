module.exports = {
	name: "whitelist",
	description: "Commandes whitelist",
	options: [
		{
			name: "add",
			description: "Ajouter un membre à la whitelist",
			type: 1,
			options: [
				{
					name: "membre",
					description: "Le membre à ajouter à la whitelist",
					type: 6,
					required: true,
				},
			],
		},
		{
			name: "del",
			description: "Supprimer un membre de la whitelist",
			type: 1,
			options: [
				{
					name: "membre",
					description: "Le membre à supprimer des whitelist",
					type: 6,
					required: true,
				},
			],
		},
		{
			name: "list",
			description: "Lister la whitelist",
			type: 1,
		},
		{
			name: "clear",
			description: "Supprimer toute la  whitelist",
			type: 1,
		},
	],
	owner: true,
	async run(client, interaction, guildData) {
		const whitelist = guildData.get("whitelist");
		const cmd = interaction.options.getSubcommand();
		if (cmd === "add") {
			const user = interaction.options.getUser("membre");
			if (user.id === client.user.id)
				return interaction.reply({
					content: `Vous ne pouvez pas whitelist le bot`,
					ephemeral: true,
				});
			if (whitelist.includes(user.id))
				return interaction.reply({
					content: `${user} est déjà whitelisté`,
					ephemeral: true,
				});
			guildData.push("whitelist", user.id).save();
			interaction.reply({
				content: `${user} est maintenant whitelisté`,
				ephemeral: true,
			});
		} else if (cmd === "del") {
			const user = interaction.options.getUser("membre");
			if (user.id === interaction.guild.whitelistId)
				return interaction.reply({
					content: `Vous ne pouvez pas supprimer de la whitelist  le propriétaire du serveur`,
					ephemeral: true,
				});
			if (!whitelist.includes(user.id))
				return interaction.reply({
					content: `${user} n'est pas whitelisté`,
					ephemeral: true,
				});
			guildData.unpush("whitelist", user.id).save();
			interaction.reply({
				content: `${user} n'est plus whitelisté`,
				ephemeral: true,
			});
		} else if (cmd === "list") {
			interaction.reply({
				embeds: [
					{
						title: "Whitelist",
						description:
							whitelist.map((id) => `<@${id}>`).join("\n") || "Aucune données",
						color: guildData.get("color"),
					},
				],
				ephemeral: true,
			});
		} else if (cmd === "clear") {
			guildData.set("whitelist", []).save();
			interaction.reply({
				content: "Toute la liste des whitelist a corréctement été éffacée",
				ephemeral: true,
			});
		}
	},
};
