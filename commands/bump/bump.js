const Discord = require("discord.js");


module.exports = {
	name: "bump",
	description: "Commandes bumps",
	options: [
		{
			name: "config",
			description: "Configurer le système de bump",
			type: 1,
		},
		{
			name: "server",
			description: "Bumper le serveur",
			type: 1,
		},
		{
			name: "help",
			description: "Explication du système de bump",
			type: 1,
		},
	],
	userPermissions: ["Administrator"],

	async run(client, interaction, guildData) {
		const config = guildData.get("bump");
		const valideTags = [
			"communautaire",
			"bots",
			"chill",
			"pfp",
			"nsfw",
			"extra",
		];
		const cmd = interaction.options.getSubcommand();
		if (cmd === "config") {
			if (!interaction.member.permissions.has("Administrator"))
				return interaction.reply({
					content:
						"Vous n'avez pas les permissions nécaissaire pour utiliser cette commande",
					ephemeral: true,
				});
			const embed = () => {
				return {
					title: "Bump Config",
					description: "*Pour plus d'infos utiliser la commande /bump help*",
					fields: [
						{
							name: `${client.botemojis.channel} Salon des Bumps`,
							value: `> ${
								config.channel ? `<#${config.channel}>` : "Indéfini"
							}`,
							inline: true,
						},
						{
							name: `🏷 Tags`,
							value: `> ${
								config.tags.map((t) => `\`${t}\``).join(" , ") || "Aucuns"
							}`,
							inline: true,
						},
						{
							name: "Status",
							value: `> ${
								config.toggle
									? client.botemojis.on
									: client.botemojis.off
							}`,
							inline: true,
						},
						{
							name: `${client.botemojis.invite} Lien d'invitation`,
							value: `> ${config.invite || "Aucun"}`,
							inline: true,
						},
						{
							name: "📝 Description",
							value: config.description
								? `\`${config.description}\``
								: "Aucune",
						},
					],
					color: guildData.get("color"),
				};
			};
			const row = () =>
				new Discord.ActionRowBuilder().setComponents(
					new Discord.StringSelectMenuBuilder()
						.setCustomId("menu-bump")
						.setPlaceholder("lYers 📘")
						.addOptions(
							{
								label: "Salon",
								description: "Modifier le salon des bumps",
								value: "channel",
								emoji: {
									id: `${client.util.getEmojiId(client.botemojis.channel)}`,
								},
							},
							{
								label: "Ajouter des tags",
								description: "Ajouter des tags sur le serveur",
								value: "add-tags",
								emoji: { name: "🏷" },
							},
							{
								label: "Supprimer des tags",
								description: "Supprimer des tags sur le serveur",
								value: "del-tags",
								emoji: { name: "➖" },
							},
							{
								label: "Invitations",
								emoji: {
									id: client.util.getEmojiId(client.botemojis.invite),
								},
								value: "invite",
								description: "Modifier le lien d'invitation",
							},
							{
								label: "Description",
								description: "Modifier la description du serveur",
								value: "desc",
								emoji: { name: "📝" },
							},
							{
								label: `${
									config.toggle ? "Désactiver" : "Activer"
								} le système de bump`,
								emoji: { name: config.toggle ? "❌" : "✅" },
								value: "toggle",
							}
						)
				);
			const message = await interaction.reply({
				embeds: [embed()],
				components: [row()],
				fetchReply: true,
			});
			const collector = await message.channel.createMessageComponentCollector({
				filter: (i) =>
					i.user.id === interaction.user.id && i.message.id === message.id,
				time: 300000,
			});
			collector.on("collect", async (collector) => {
				const messageCollector = () =>
					interaction.channel.createMessageCollector({
						filter: (m) => m.author.id === interaction.user.id,
						time: 300000,
						max: 1,
					});
				const update = () => {
					interaction.editReply({ embeds: [embed()], components: [row()] });
				};
				const error = (response, text) => {
					response.reply(text).then((m) => {
						setTimeout(() => {
							m.delete();
							response.delete();
							collector.deleteReply();
							update();
						}, 4000);
					});
				};
				if (collector.values[0] === "channel") {
					collector.reply({
						content: "Quel est le salon des bumps ?",
						fetchReply: true,
					});
					const msgC = messageCollector();
					msgC.on("collect", async (response) => {
						const channel = client.util.getChannel(response, response.content);
						if (!channel || channel.type !== 0)
							return error(response, "Salon invalide");
						config.channel = channel.id;
						guildData.set("bump", config).save();
						update();
						collector.deleteReply();
						response.delete();
					});
				} else if (collector.values[0] === "add-tags") {
					collector.reply({
						content: `Quel sont les nouveaux tags ? (3 maximum)\nTags Valide: ${valideTags
							.map((v) => `\`${v}\``)
							.join(" , ")} `,
						fetchReply: true,
					});
					const msgC = messageCollector();
					msgC.on("collect", async (response) => {
						const tags = response.content.trim().toLowerCase().split(" ");
						if (tags.length > 3 || config.tags.length + tags.length > 3)
							return error(
								response,
								`Vous ne pouvez pas assigner plus de 3 tags au serveur`
							);

						const invalideTags = [];
						tags.forEach((tag) => {
							if (!valideTags.includes(tag)) invalideTags.push(tag);
						});
						if (invalideTags.length >= 1)
							return error(
								response,
								`Les tag(s) suivants sont invalide: ${invalideTags.join(" , ")}`
							);
						if (config.tags.some((tag) => tags.includes(tag)))
							return error(
								response,
								`Un tag est déjà assigné aux tags du serveur`
							);
						await tags.forEach((tag) => config.tags.push(tag));
						guildData.set("bump", config).save();
						update();
						collector.deleteReply();
						response.delete();
					});
				} else if (collector.values[0] === "del-tags") {
					collector.reply({
						content: "Quels sont les tags à supprimer ?",
						fetchReply: true,
					});
					const msgC = messageCollector();
					msgC.on("collect", async (response) => {
						const tags = response.content.trim().toLowerCase().split(" ");
						const invalideTags = [];
						tags.forEach((tag) => {
							if (!config.tags.includes(tag)) invalideTags.push(tag);
						});
						if (invalideTags.length >= 1)
							return error(
								response,
								`Les tag(s) suivants ne sont pas assigné: ${invalideTags.join(
									" , "
								)}`
							);
						await tags.forEach(
							(tag) => (config.tags = config.tags.filter((t) => t !== tag))
						);
						guildData.set("bump", config).save();
						update();
						collector.deleteReply();
						response.delete();
					});
				} else if (collector.values[0] === "desc") {
					collector.reply({
						content: "Quel est la nouvelle description ?",
						fetchReply: true,
					});
					const msgC = messageCollector();
					msgC.on("collect", async (response) => {
						config.description = response.content;
						guildData.set("bump", config).save();
						update();
						collector.deleteReply();
						response.delete();
					});
				} else if (collector.values[0] === "invite") {
					collector.reply({
						content: "Quel est le nouveau lien d'invitation ?",
						fetchReply: true,
					});
					const msgC = messageCollector();
					msgC.on("collect", async (response) => {
						const invite = response.content;
						let discordInvite =
							/(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
						if (!discordInvite.test(invite))
							return error(response, "Lien invalide");
						config.invite = invite;
						guildData.set("bump", config).save();
						update();
						collector.deleteReply();
						response.delete();
					});
				} else if (collector.values[0] === "toggle") {
					collector.deferUpdate();
					config.toggle ? (config.toggle = false) : (config.toggle = true);
					guildData.set("bump", config).save();
					update();
				}
			});
		} else if (cmd === "server") {
			let { tags, channel, resetAt, description, invite, toggle } = config;
			if(!toggle) return interaction.reply({content: "Le système de bump n'est pas activé", ephemeral: true})
			if(tags.length === 0) return interaction.reply({content: "Aucun tag n'a été défini pour le serveur", ephemeral: true})
			if(!invite) return interaction.reply({content: "Aucune invitation n'a été définie pour le serveur", ephemeral: true})
			if(!channel || !interaction.guild.channels.cache.get(channel)) return interaction.reply({content: "Il n'y aucun salon de bump définie", ephemeral: true})


			if (resetAt > Date.now())
				return interaction.reply({
					content: `Ce serveur pourra être bump dans <t:${Math.round(
						resetAt / 1000
					)}:R>`,
				});

			channel = interaction.guild.channels.cache.get(channel);
			if (!channel)
				return interaction.reply({
					content: `Pour pouvoir bump le serveur, il faut configurer le salon des bumps */bump config*\n*/bump help pour plus d'informations*`,
				});
			for (const guildId in client.database.guilds) {
				const gdata = client.database.guilds[guildId];
				if (gdata.bump?.toggle) {
					const channel = client.guilds.cache
						.get(gdata.guildId)
						?.channels.cache.get(gdata.bump.channel);
					if (
						tags.some((t) => gdata.bump?.tags.includes(t)) &&
						gdata.guildId !== interaction.guildId
					) {
						channel?.send({
							embeds: [
								{
									title: `Bump\n${interaction.guild.name}`,
									description: description ||"Aucune description",
									fields: [
										{
											name: `${client.botemojis.members} Membres:`,
											value: `\`${interaction.guild.memberCount}\``,
											inline: true,
										},
										{
											name: `${client.botemojis.invite} Invitation:`,
											value: invite || "non défini",
											inline: true,
										},
									],
									thumbnail: {
										url: interaction.guild.iconURL({
											animated: true,
											size: 64,
										}),
									},
									color: gdata.color || process.env.COLOR,
								},
							],
						});
					}
				}
				interaction
					.reply({
						embeds: [
							{
								title: "Bump",
								description: `${client.botemojis.members} ${interaction.user} a bump le serveur!`,
								footer: {
									iconURL: interaction.user.avatarURL({ animated: true }),
									text: interaction.user.username,
								},
								color: guildData.get("color"),
							},
						],
					})
					.then(() => {
						guildData
							.set("bump", {
								...guildData.get("bump"),
								resetAt: Date.now() + require("ms")("4h"),
							})
							.save();
					})
					.catch((e) => {});
			}
		} else if (cmd === "help") {
			interaction.reply({
				embeds: [
					{
						title: "Système de Bump",
						description:
							"**__lYers__** possède un système de *bump* avancé, mais facile à comprendre\nChaque serveur peut attribué maximum **3 tags**, **ces tags permettent d'uniquement référencer le serveur dans les serveurs qui possède un ou plusieurs même tags**\n**__Le salon des bumps__**: Le salon des bumps permet de *référencer les serveurs ayant les même tags que le votre.*\nVoici une image d'un bump de serveur:",
						image: {
							url: "https://media.discordapp.net/attachments/1060184706064338944/1066703882346049628/image.png",
						},
						color: guildData.get("color"),
					},
				],
				ephemeral: true,
			});
		}
	},
};
