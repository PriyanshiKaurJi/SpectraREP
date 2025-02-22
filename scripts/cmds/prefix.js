const fs = require("fs");
const path = require("path");
const configPath = path.resolve(__dirname, "../../config.json");

module.exports = {
    name: "prefix",
    description: "View or change the bot's command prefix",
    permission: 0,
    cooldowns: 3,
    dmUser: true,
    author: "Priyanshi Kaur",
    run: async ({ sock, m, args }) => {
        // Read the current config
        let config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        let currentPrefix = config.botSettings.prefix || "+";

        // If no arguments, show the current prefix
        if (!args.length) {
            return await sock.sendMessage(m.key.remoteJid, {
                text: `✅ *Current Bot Prefix:* ${currentPrefix}\n\nTo change prefix, use: ${currentPrefix}prefix <newPrefix>`,
            });
        }

        // If user provides a new prefix, ask for confirmation
        const newPrefix = args[0];

        if (newPrefix.length > 2) {
            return await sock.sendMessage(m.key.remoteJid, { text: "❌ Prefix must be 1 or 2 characters only!" });
        }

        await sock.sendMessage(m.key.remoteJid, {
            text: `⚠️ Are you sure you want to change the prefix from *${currentPrefix}* to *${newPrefix}*? (Reply with *y* to confirm, *n* to cancel)`,
        });

        // Wait for user response
        sock.ev.once("messages.upsert", async (chatUpdate) => {
            const msg = chatUpdate.messages[0];
            if (!msg.message.conversation) return;

            const replyText = msg.message.conversation.trim().toLowerCase();
            if (replyText === "y") {
                // Update the prefix in config.json
                config.botSettings.prefix = newPrefix;
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

                // Send confirmation message
                await sock.sendMessage(m.key.remoteJid, {
                    text: `✅ Prefix successfully changed to: *${newPrefix}*`,
                });

                // Reload bot settings (if needed)
                global.prefix = newPrefix;
            } else {
                await sock.sendMessage(m.key.remoteJid, {
                    text: "❌ Prefix change canceled.",
                });
            }
        });
    },
};