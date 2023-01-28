const Discord = require("discord.js")

module.exports = {
	name: "info",
	description: "Commandes info",
	options: [
		{
			name: "bot",
			description: "Informations sur lYers 📘",
			type: 1,
		},
		{
			name: "user",
			description: "Informations sur un utilisateur",
			type: 1,
			options: [{ name: "utilisateur", description: "L'utilisateur", type: 6 }],
		},
		{
			name: "server",
			description: "Informations sur le serveur",
			type: 1,
		},
	],

	async run(client, interaction, guildData) {
		const cmd = interaction.options.getSubcommand();
		if (cmd === "bot") {
			let embed = {
				title: "lYers 📘 Info",
				fields: [
					{
						name: `${client.botemojis.dev} Développeur`,
						value: "> <@1036089162945789963>",
						inline: true,
					},
					{
						name: `${client.botemojis.support} Support`,
						value: `> [Support](${process.env.SUPPORT})`,
						inline: true,
					},
					{
						name: `${client.botemojis.members} Utilisateurs`,
						value: `> \`${client.users.cache.size}\``,
						inline: true,
					},
					{
						name: `${client.botemojis.server} Serveurs`,
						value: `> \`${client.guilds.cache.size}\``,
						inline: true,
					},
				],
				color: guildData.get("color"),
			};
			const row = new Discord.ActionRowBuilder().setComponents(
				new Discord.ButtonBuilder()
					.setLabel("lYers")
					.setEmoji({ name: "📘" })
					.setStyle("Link")
					.setURL(
						"https://discord.com/api/oauth2/authorize?client_id=1058745124588376105&permissions=8&scope=bot%20applications.commands"
					),
				new Discord.ButtonBuilder()
					.setLabel("Support")
					.setEmoji({
						id: client.util.getEmojiId(client.botemojis.support),
					})
					.setStyle("Link")
					.setURL(process.env.SUPPORT)
			);
			interaction.reply({
				embeds: [embed],
				components: [row],
				ephemeral: true,
			});
		} else if (cmd === "user") {
			const user =
				interaction.options.getUser("utilisateur") || interaction.user;
			 const usermanager = client.managers.userManager.getOrCreate(user.id)
			let embed = {
				title: `${user.username}#${user.discriminator} Info`,
				thumbnail: {
					url: user.avatarURL({ size: 64, format: "png", animated: true }),
				},
				color: guildData.get("color"),
				fields: [
					{
						name: `${client.botemojis.user} Surnom (serveur)`,
						value: `> ${
							interaction.guild.members.cache.get(user.id)?.displayName ||
							"Aucun"
						}`,
						inline: true,
					},
					{
						name: `${client.botemojis.role} Rôle le plus haut`,
						value: `> ${
							interaction.guild.members.cache.get(user.id).roles.highest ||
							"Aucun"
						}`,
					},
					{
						name: `${client.botemojis.setup} Dernier prevname`,
						value: `> ${
							usermanager.get("prevnames")[
								usermanager.get("prevnames").length - 1
							]?.name || "Aucun"
						}`,
					},
					{
						name: "`📅` Compte crée le",
						value: `> <t:${Math.round(user.createdTimestamp / 1000)}:d>`,
					},
				],
			};
			interaction.reply({ embeds: [embed], ephemeral: true });
		} else if (cmd === "server") {
			const { guild } = interaction;
			let embed = {
				title: `${guild.name} Infos`,
				thumbnail: {
					url: guild.iconURL({ size: 64, format: "png", animated: true }),
				},
				color: guildData.get("color"),
				fields: [
					{
						name: `${client.botemojis.members} Membres`,
						value: `> \`${guild.memberCount}\``,
					},
					{
						name: `${client.botemojis.role} Rôles`,
						value: `> ${guild.roles.highest} + ${
							guild.roles.cache.size - 1
						} rôles...`,
					},
					{
						name: `${client.botemojis.channel} Salons`,
						value: `> ${guild.channels.cache.first()} + ${
							guild.channels.cache.size - 1
						} salons...`,
					},
					{
						name: `${client.botemojis.owner} Propriétaire`,
						value: `> <@${guild.ownerId}>`,
					},
				],
			};
			interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};
