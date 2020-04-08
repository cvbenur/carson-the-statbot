const path = require('path');
const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const table = new ascii().setHeading("Command", "Load status");


const commandsDir = path.join(__dirname, "..", "..", "js", "commands");


module.exports = (client) => {
    readdirSync(commandsDir).forEach(dir => {

        const currentDir = path.join(commandsDir, dir);
        const commands = readdirSync(currentDir).filter(f => f.endsWith(".js"));

        for (let file of commands) {
            const pullPath = path.join(currentDir, file);

            const pull = require(pullPath);

            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, '✔️');
            } else {
                table.addRow(file, '❌ -> missing file.');
                continue;
            }

            if (pull.aliases && Array.isArray(pull)) {
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
            }

            console.log(`Loaded command : ${pullPath.slice(pullPath.indexOf('/js/'))}`);
        }
    });
}