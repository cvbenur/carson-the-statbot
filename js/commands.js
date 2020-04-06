const Pong = require('./commands/pong.js');
const Prefix = require('./commands/prefix.js');
const Help = require('./commands/help.js');
const Start = require('./commands/start.js');
const Stats = require('./commands/stats.js');



module.exports = {

    // Reacting to only prefix
    start: Start,


    // 'ping' command
    pong: Pong,


    // 'help' command
    help: Help,


    // 'prefix' command
    prefix: Prefix,


    // 'stats' command
    stats: Stats
};