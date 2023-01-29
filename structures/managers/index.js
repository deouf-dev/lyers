const {Guilds} = require("./guilds");
const {Users} = require("./users");

class Managers {
    constructor(client) {
        this.guildManager = new Guilds(client).load();
        this.userManager = new Users(client).load();
    }
}

exports.Managers = Managers;