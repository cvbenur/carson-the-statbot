const Help = require('./commands/help.js');
const Pong = require('./commands/pong.js');
const Prefix = require('./commands/prefix.js');
const Reset = require('./commands/reset.js');
const Start = require('./commands/start.js');
const Stats = require('./commands/stats.js');



module.exports = {

    // Reacting to only prefix
    start: Start,


    // 'ping' command
    pong: Pong,


    // 'prefix' command
    prefix: Prefix,


    // 'reset' command
    reset: Reset,


    // 'help' command
    help: Help,


    // 'stats' command
    stats: Stats
};