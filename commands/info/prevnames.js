module.exports = {
	name: "prevnames",
	description: "Commandes prevnames",
	options: [
		{
			name: "list",
			description: "Lister les anciens pseudos d'un utilisateur",
			type: 1,
			options: [
				{
					name: "utilisateur",
					description: "L'utilisateur",
					required: false,
					type: 6,
				},
			],
		},
		{
			name: "clear",
			description: "Supprimer vos anciens pseudos",
			type: 1,
		},
	],

	async run(client, interaction, guildData) {
		const cmd = interaction.options.getSubcommand();
		if (cmd === "list") {
			let user = interaction.options.getUser("utilisateur") || interaction.user;
			if (!user.manager)
				user.manager = client.managers.userManager.getOrCreate(
					user.id
				);
			const prevnames = user.manager.get("prevnames");
			let embed = {
				title: `Prevnames: ${user.username}#${user.discriminator}`,
				description:
					prevnames
						.map((prevname) => `${prevname.name} - <t:${prevname.timestamp}:R>`)
						.join("\n") || "Aucune données",
				color: guildData.get("color"),
			};
			interaction.reply({ embeds: [embed], ephemeral: true });
		} else if (cmd === "clear") {
			interaction.user.manager.set("prevnames", []).save();
			interaction.reply({
				content: "Tous vos anciens pseudos ont corréctement été éffacé",
				ephemeral: true,
			});
		}
	},
};
