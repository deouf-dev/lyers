const Discord = require("discord.js")

module.exports = {
	name: "setcolor",
	description: "Modifier la couleur des embeds du bot",
	options: [
		{
			name: "couleur",
			required: true,
			description: "La nouvelle couleur",
			type: 3,
		},
	],
	userPermissions: ["Administrator"],

	async run(client, interaction, guildData) {
		const colorstr =
			interaction.options.getString("couleur").charAt(0).toUpperCase() +
			interaction.options
				.getString("couleur")
				.replace(interaction.options.getString("couleur").charAt(0), "");
		try {
			const color = Discord.resolveColor(colorstr);
			guildData.set("color", color).save();
			interaction.reply({
				embeds: [
					{
						description: "Nouvelle couleur",
						color: color,
					},
				],
			});
		} catch (e) {
			if (e)
				interaction.reply({ content: "Couleur invalide", ephemeral: true });
		}
	},
};
