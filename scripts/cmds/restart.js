const fs = require('fs');
const path = require('path');

module.exports = {
    name: "restart",
    description: "Restarts the bot",
    permission: 1,
    cooldowns: 0,
    dmUser: false,
    author: "Priyanshi Kaur",
    run: async ({ sock, m, sender }) => {
        try {
            if (!global.owner.includes(sender.replace(/[^0-9]/g, ""))) {
                return await sock.sendMessage(m.key.remoteJid, { text: "❌ You don't have permission to restart the bot!" }, { quoted: m });
            }

            const restartFilePath = "./tmp/restart.txt";

            fs.writeFileSync(restartFilePath, Date.now().toString());

            await sock.sendMessage(m.key.remoteJid, { text: "♻️ Restarting bot..." }, { quoted: m });

            setTimeout(() => {
                process.exit(1);
            }, 2000);

        } catch (error) {
            console.error("Restart Error:", error.message);
            await sock.sendMessage(m.key.remoteJid, { text: "❌ Failed to restart the bot." }, { quoted: m });
        }
    },
};