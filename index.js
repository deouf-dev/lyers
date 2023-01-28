require("dotenv").config();
const {lYers} = require("./structures/lYers");
new lYers(true)
process.on("uncaughtException", (e) => console.log(e))