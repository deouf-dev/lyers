const {REST, Routes} = require("discord.js")

class Util {
    constructor(client) {
        this.client = client;
        this.dangerousPerms = [
            "Administrator",
            "ManageGuild",
            "ManageChannels",
            "ManageRoles",
            "BanMembers",
            "KickMembers",
            "ManageMessages",
        ]
    }
    commitCommands(){
        new REST({version: "10"}).setToken(this.client.token).put(Routes.applicationCommands(this.client.user.id), {body: this.client.commands.toJSON()})
    }
    getEmojiId(emojiString){
        const a = emojiString.split("");
        let returns = ""
        a.forEach((v) => {
            if(!isNaN(v)) returns = returns + v
        })
        return returns;
    }
    getChannel(ctx, arg){
        return ctx.mentions.channels.first() || ctx.guild.channels.cache.get(arg) || ctx.guild.channels.cache.find((c) => c.name.toLowerCase().includes(arg.toLowerCase()))
    }
    getRole(ctx, arg){
        return ctx.mentions.roles.first() || ctx.guild.roles.cache.get(arg) || ctx.guild.roles.cache.find((r) => r.name.toLowerCase().includes(arg.toLowerCase()))
    }
    isOwner(guild, id){
        const guildData = this.client.managers.guildManager.getOrCreate(guild.id);
        const owners = guildData.get("owners");
        return owners.includes(id) || id === guild.ownerId
    }
    isWhitelist(guild, id){
        const guildData = this.client.managers.guildManager.getOrCreate(guild.id);
        const wl = guildData.get("whitelist");
        return wl.includes(id) || this.isOwner(guild, id) || id === guild.ownerId
    }
    antiraidLog(guild, content){
        const guildData = this.client.managers.guildManager.getOrCreate(guild.id);
        if(!guildData.get("logs").antiraid) return;
        const logChannel = guild.channels.cache.get(guildData.get("logs").antiraid);
        let embed = {
            title: "Antiraid Logs",
            footer: {text: "lYers 📘"},
            description: content,
            color: guildData.get("color")
        }
        logChannel?.send({embeds: [embed]}).catch()
    }
    modLog(guild ,content){
        const guildData = this.client.managers.guildManager.getOrCreate(guild.id);
        if(!guildData.get("logs").moderation) return;
        const logChannel = guild.channels.cache.get(guildData.get("logs").moderation);
        let embed = {
            title: "Modération Logs",
            footer: {text: "lYers 📘"},
            description: content,
            color: guildData.get("color")
        }
        logChannel?.send({embeds: [embed]}).catch()
    }
    punish(punish, executorMember, reason = ""){
        return new Promise((res) => {
            switch(punish){
                case "derank":
                    if(!executorMember.manageable) return res({punished: false})
                    executorMember.roles.cache.filter((r) => this.dangerousPerms.some((p) => r.permissions.has(p))).forEach((role) => {
                        executorMember.roles.remove(role).catch((e) => {})
                    })
                    res({punished: true})
                    break;
                case "kick":
                    executorMember.kick(reason).then(() => res({punished: true})).catch((e) => res({punished: false}))
                    break;
                case "ban":
                    executorMember.ban(reason).then(() => res({punished: true})).catch((e) => res({punished: false}))
                    break;
            }
        })
    }
    embedBuilder(interaction){
        return require("./embedBuilder")(this.client, interaction)
    }
    checkDuration(string){
        return !(!string.endsWith("s") && !string.endsWith("m") && !string.endsWith("h") && !string.endsWith("d"));
    }
    replaceInvitesVariables(string, inviter, member, guild, invitesCount){
        return string.replace("{member}", member)
        .replace("{inviter}", inviter)
        .replace("{inviterName}", inviter.username)
        .replace("{memberName}", member.user.username)
        .replace("{membersCount}", guild.memberCount.toString())
        .replace("{invitesCount}", invitesCount)

    }
}


exports.Util = Util;