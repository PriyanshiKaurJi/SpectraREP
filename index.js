const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const express = require('express');
const { default: makeWASocket } = require("@whiskeysockets/baileys"); // Ensure correct import

console.clear();
console.log('\n'.repeat(2));

const terminalWidth = process.stdout.columns || 80;
const line = chalk.bold.rgb(255, 165, 0)('─'.repeat(terminalWidth));

const spectraText = figlet.textSync('SPECTRA', {
  font: 'Small',
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: terminalWidth,
  whitespaceBreak: true
});

// Display banner
console.log(line);
console.log(chalk.blueBright(spectraText));
console.log(chalk.cyan.bold('Spectra Bot - A Simple WhatsApp Chat Bot'));
console.log(chalk.magenta('    Created By Mr - Perfect with ❤️'));
console.log(
  chalk.yellow.bold(
    'Source Code: https://github.com/Mr-Perfect-Spector/Spectra'
  )
);
console.log(line);

console.log(
  chalk.red.bold(
    '\n⚠️  WARNING: Do not attempt to claim this project as your own, modify the author, or remove credits.\n'
  )
);

console.log(line);

// Check restart time file
const restartFilePath = "./tmp/restart.txt";
if (fs.existsSync(restartFilePath)) {
    try {
        const lastRestartTime = parseInt(fs.readFileSync(restartFilePath, "utf-8"));
        const restartDuration = ((Date.now() - lastRestartTime) / 1000).toFixed(2);

        console.log(chalk.green.bold(`✅ Bot restarted successfully in ${restartDuration} seconds!`));

        // Connect to WhatsApp and send restart message
        (async () => {
            const sock = makeWASocket({ printQRInTerminal: true });

            sock.ev.on("connection.update", async (update) => {
                if (update.connection === "open") {
                    await sock.sendMessage(global.owner[0] + "@s.whatsapp.net", { text: `✅ Bot restarted successfully in ${restartDuration} seconds!` });
                    fs.unlinkSync(restartFilePath); // Remove restart file after sending message
                }
            });
        })();
    } catch (err) {
        console.error(chalk.red.bold("⚠️ Error reading restart time file!"), err.message);
    }
}

// Start the bot
require('./bot.js');

// Create an Express server to keep the bot alive
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Spectra Bot is Running!');
});

app.listen(PORT, () => {
  console.log(chalk.green.bold(`Server is running on port ${PORT}`));
});