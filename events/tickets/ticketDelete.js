
module.exports = {
     name: "channelDelete",

     async run(client, channel) {
          const guildData = client.managers.guildManager.getOrCreate(channel.guild.id)
          const tickets = guildData.get("allTickets");
          const ticket = tickets.find((t) => t.channel === channel.id);
          if(!ticket) return;
          guildData.set(`allTickets`, tickets.filter((t) => t !== ticket))
     }
}