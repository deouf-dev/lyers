const Discord = require("discord.js")

module.exports = {
	name: "banner",
	description: "Bannière d'un utilisateur",
	options: [
		{
			name: "utilisateur",
			description: "L'utilisateur",
			type: 6,
		},
	],

	async run(client, interaction, guildData) {
		let user = interaction.options.getUser("utilisateur") || interaction.user;
		user = await client.users.fetch(user.id, { force: true });
		if (!user.banner)
			return interaction.reply({
				content: `${user} n'a pas de bannière`,
				ephemeral: true,
			});
		let embed = {
			title: `${user.username}#${user.discriminator}`,
			image: {
				url: user.bannerURL({ animated: true, size: 1024, format: "png" }),
			},
			color: guildData.get("color"),
		};
		const button = new Discord.ActionRowBuilder().setComponents(
			new Discord.ButtonBuilder()
				.setStyle("Link")
				.setLabel("Bannière")
				.setEmoji({ name: "🖼️" })
				.setURL(user.bannerURL({ animated: true, size: 1024, format: "png" }))
		);
		interaction.reply({
			embeds: [embed],
			components: [button],
			ephemeral: true,
		});
	},
};
