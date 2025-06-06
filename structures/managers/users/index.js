const {Collection} = require("discord.js");

class Cache extends Collection {
    constructor(client){
        super();
        this.client = client;

    }
    add(key, values = {}){
        this.set(key, new Manager(this, {userId: key, ...values}))
        return this;
    }
    getOrCreate(key){
        return this.has(key) ? this.get(key) : this.add(key).get(key)
    }
    load(){
        this.client.database.users ? null : this.client.database.users = {}
        for(const key in (this.client.database.users || {})){
            this.add(key, this.client.database.users[key]);
        }
        return this;
    }
}

class Manager {
    constructor(cache, values){
        this.cache = cache;
        this.key = values.userId;
        this.values = {...require("./model"), ...values}
    }
    save(){
        this.cache.client.database.users[this.key] = this.values;
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
    delete(key){
        this.values[key] = undefined;
        this.save();
        return this;
    }
    all(){
        return this.values;
    }
}

exports.Users = Cache;