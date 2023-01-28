const {Guilds} = require("./guilds");
const { Mutes } = require("./mutes");
const {Users} = require("./users");

class Managers {
    constructor(client) {
        this.guildManager = new Guilds(client).load();
        this.userManager = new Users(client).load();
        this.muteManager = new Mutes(client).load()
    }
}

exports.Managers = Managers;