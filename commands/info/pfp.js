const Discord = require("discord.js")

module.exports = {
	name: "pfp",
	description: "Avatar d'un utilisateur",
	options: [
		{
			name: "utilisateur",
			description: "L'utilisateur",
			type: 6,
		},
	],

	async run(client, interaction, guildData) {
		const user = interaction.options.getUser("utilisateur") || interaction.user;
		let embed = {
			title: `${user.username}#${user.discriminator}`,
			image: {
				url: user.avatarURL({ animated: true, size: 512, format: "png" }),
			},
			color: guildData.get("color"),
		};
		const button = new Discord.ActionRowBuilder().setComponents(
			new Discord.ButtonBuilder()
				.setStyle("Link")
				.setLabel("Avatar")
				.setEmoji({ name: "🖼️" })
				.setURL(user.avatarURL({ animated: true, size: 512, format: "png" }))
		);
		interaction.reply({
			embeds: [embed],
			components: [button],
			ephemeral: true,
		});
	},
};
