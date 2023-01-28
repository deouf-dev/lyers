const {Client, Collection} = require("discord.js"),
    fs = require("fs"),
    {Managers} = require("./managers"),
    {Util} = require("./util"),
    {inviteTracker} = require("discord-inviter")


class lYers extends Client {
    constructor(test = false){
        super({intents: 3276799});
        this.test = test;
        this.commands = new Collection();
        this.util = new Util(this);
        this.botemojis = require("../emojis");
        this.inviter = new inviteTracker(this);
        this.init();
    }
    init(){
        this.login(this.test ? process.env.TEST_TOKEN : process.env.TOKEN);
        this.initCommands();
        this.initEvents();
        this.initDatabase()
    }
    initCommands(){
        for(const dir of fs.readdirSync("./commands")){
            for(const fileName of fs.readdirSync(`./commands/${dir}`)){
                const file = require(`../commands/${dir}/${fileName}`);
                file.category = dir;
                this.commands.set(file.name, file)
                delete require.cache[require.resolve(`../commands/${dir}/${fileName}`)]
            }
        }
    }
    initEvents(){
        for(const dir of fs.readdirSync("./events")){
            for(const fileName of fs.readdirSync(`./events/${dir}`)){
                const file = require(`../events/${dir}/${fileName}`);
                dir === "invites" ? this.inviter.on(file.name, (...args) => file.run(this, ...args)) : this.on(file.name, (...args) => file.run(this, ...args))
                delete require.cache[require.resolve(`../events/${dir}/${fileName}`)]
            }
        }
    }
    initDatabase(){
        this.database = require("../database.json");
        this.managers = new Managers(this)
        this.writeDatabase = function() {
            fs.writeFileSync("./database.json", JSON.stringify(this.database));
        }
    }
}

exports.lYers = lYers;