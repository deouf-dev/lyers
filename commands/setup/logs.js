const Discord = require("discord.js")

module.exports = {
	name: "logs",
	description: "Configurer les logs du serveur",
	owner: true,
	userPermissions: ["Administrator"],

	async run(client, interaction, guildData) {
		const config = guildData.get("logs");
		const row = new Discord.ActionRowBuilder().addComponents(
			new Discord.StringSelectMenuBuilder()
				.setCustomId("menu-logs")
				.setPlaceholder("lYers 📘")
				.setOptions({
					label: "Antiraid",
					emoji: { id: client.util.getEmojiId(client.botemojis.shield) },
					description: "Définir le salon des logs Antiraid",
					value: "antiraid",
				}, {label: "Modération", emoji: {id: client.util.getEmojiId(client.botemojis.mod)}, description: "Définir le salon des logs Modération", value: "moderation"})
		);
		const message = await interaction.reply({
			embeds: [embed()],
			components: [row],
			fetchReply: true,
		});
		const collector = message.channel.createMessageComponentCollector({
			time: 300000,
			filter: (i) =>
				i.user.id === interaction.user.id && i.message.id === message.id,
		});
		collector.on("collect", async (collector) => {
			const value = collector.values[0];
				collector.reply({
					content: `Quel est le nouveau salon des logs ${value} ?`,
					fetchReply: true,
				});
				const msgC = msgCollector();
				msgC.on("collect", async (response) => {
					const channel = client.util.getChannel(response, response.content);
					if (response.content.trim().toLowerCase() === "off") {
						config[value] = false;
						setData();
						update();
						collector.deleteReply();
						return response.delete();
					}
					if (!channel || channel.type !== 0) error(response, `Salon invalide`);
					config[value] = channel.id;
					setData();
					update();
					collector.deleteReply();
					response.delete();
				});

			function msgCollector() {
				return interaction.channel.createMessageCollector({
					filter: (m) => m.author.id === interaction.user.id,
					max: 1,
					time: 300000,
				});
			}
			function error(response, text) {
				response.reply(text).then((m) => {
					setTimeout(() => {
						response.delete();
						m.delete();
						text.delete();
						update();
					}, 3000);
				});
			}
		});
		function embed() {
			return {
				title: "Logs",
				description: "*Définir off en salon pour désactivé la logs*",
				color: guildData.get("color"),
				fields: [
					{
						name: `${client.botemojis.shield} Antiraid`,
						value:
							"> " + (config.antiraid ? `<#${config.antiraid}>` : "Indéfini"),
					},
					{
						name: `${client.botemojis.mod} Modération`,
						value: `> ${config.moderation ? `<#${config.moderation}>` : "Indéfini"}`
					}
				],
			};
		}
		function update() {
			interaction.editReply({ embeds: [embed()] });
		}
		function setData() {
			guildData.set("logs", config).save();
		}
	},
};
