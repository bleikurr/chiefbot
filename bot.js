var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot

var bot = new Discord.Client();
bot._isConnected = false;
bot._currentConnection = null;

bot.on('ready', function (evt) {
    console.log("Connected");
});

async function joinVoiceChannel(msg, filename = null) {
    if (bot._isConnected) {
        if(bot._currentConnection.channel.members.size === 1) {
            bot._currentConnection.disconnect();
            await new Promise(r => setTimeout(r, 1000));
        } else {
            msg.channel.send("Leave me alone! I'm busy!");
            return;
        }
    }

    vs = msg.member.voice;
    vcID = vs.channelID;
    if (vcID) {
        if (bot.currentConnection == null && vs.channel.joinable) {
            vs.channel.join()
                .then(connection => {
                    bot._isConnected = true;
                    bot._currentConnection = connection;
                    console.log("Connected to voice channel: " + connection.channel.name);
                    if (filename) playClip(filename);
                    connection.on("disconnect", () => {
                        console.log("Disconnected from voice channel: " + connection.channel.name);
                        bot._isConnected = false;
                        bot._currentConnection = null;
                    })
                })
                .catch(console.error);
        }
    }
}

function playClip(filename) {
    const dispatcher = bot._currentConnection.play(filename);
}

function playAudio(msg, filename) {
    if (!bot._isConnected) {
        joinVoiceChannel(msg, filename);
    } else {
        playClip(filename);
    }
}

bot.on('message', function (msg) {  
    content = msg.content;
    
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (content.substring(0, 1) == '!') {
        const args = content.substring(1).split(' ');
       
        if (args[0] == "chief") {
            switch (args[1]) {
                case "drunk":
                    playAudio(msg, "./audio/chief_drunk.mp3");   
                    break;
                case "kitty":
                    playAudio(msg, "./audio/chief_meow.mp3");
                    break;
                case "wait":
                    playAudio(msg, "./audio/chief_wait.mp3");
                    break;
                case "sad":
                    playAudio(msg, "./audio/chief_sad.mp3");
                    break;
                case "shame":
                    playAudio(msg, "./audio/chief_shame.mp3");
                    break;
                case "cheeky":
                    playAudio(msg, "./audio/chief_cheeky.mp3");
                    break;
                case "lol":
                    playAudio(msg, "./audio/chief_lol.mp3");
                    break;
                case "join":
                    joinVoiceChannel(msg);
                    break;
                case "leave":
                    if(bot._isConnected) {
                        if (msg.member.voice.channelID === bot._currentConnection.channel.id)
                            bot._currentConnection.disconnect();
                        else
                            msg.channel.send("You're not the boss of me!");
                    }
                    else msg.channel.send("Where do you want me to go exactly?");
                    break;
            } 
        } else if (args[0] == "gatsby") {
            switch (args[1]) {
                case "noodle":
                    playAudio(msg, "./audio/gatsby_wetnoodle.mp3");
                    break;
            }
        } else if (args[0] == "clazzy") {
            switch (args[1]) {
                case "happy":
                    playAudio(msg, "./audio/clazzy_ringtone.mp3");
                    break;
            }
        } else if (args[0] == "kenny") {
            switch (args[1]) {
                case "whee":
                    playAudio(msg, "./audio/kenny_excited.mp3");
                    break;
            }
        }
     }
});


bot.login(auth.token);


process.on('SIGINT', () => {
    bot._currentConnection.on("disconnect", () => {bot.destroy()});
    if(bot._isConnected) bot._currentConnection.disconnect();
});