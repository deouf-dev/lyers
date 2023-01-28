const {Collection} = require("discord.js");

class Cache extends Collection {
    constructor(client){
        super();
        this.client = client;

    }
    add(key, values = {}){
        this.set(key, new Manager(this, {guildId: key, ...values}))
        return this;
    }
    getOrCreate(key){
        return this.has(key) ? this.get(key) : this.add(key).get(key)
    }
    load(){
        this.client.database.guilds ? null : this.client.database.guilds = {}
        for(const key in (this.client.database.guilds || {})){
            this.add(key, this.client.database.guilds[key]);
        }
        return this;
    }
}

class Manager {
    constructor(cache, values){
        this.cache = cache;
        this.key = values.guildId;
        this.values = {
            ...require("./model"),
            ...values,
        }
    }
    save(){
        this.cache.client.database.guilds[this.key] = this.values;
        this.cache.client.writeDatabase();
        return this;
    }
    get(key){
        return this.values[key];
    }
    set(key, value){
        this.values[key] = value;
        this.save();
        return this;
    }
    push(key, value){
        this.values[key].push(value);
        this.save();
        return this;
    }
    unpush(key, value){
        this.values[key] = this.values[key].filter((k) => k !== value);
        this.save();
        return this;
    }
    replace(key, oldValue, newValue){
        this.unpush(key, oldValue);
        this.push(key, newValue)
        return this;
    }
    delete(key){
        this.values[key] = undefined;
        return this;
    }
    all(){
        return this.values;
    }
}

exports.Guilds = Cache;