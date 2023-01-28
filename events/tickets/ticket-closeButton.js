
module.exports = {
     name: "interactionCreate",

     async run(client, button){
          if(button.customId !== "ticket-close") return;
          button.reply({content: "Ce ticket sera fermé dans 3s...."});
          setTimeout(() => {
               button.channel.delete().catch((e) => {
                    button.channel.send(`Je n'ai pas pu fermer le ticket pour une raison inconnue`)
               })
          })
     }
}