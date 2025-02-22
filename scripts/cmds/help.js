const fs = require("fs");
const path = require("path");

module.exports = {
  name: "help",
  description: "Show all available commands or details of a specific command",
  permission: 0,
  cooldowns: 3,
  dmUser: true,
  author: "Priyanshi Kaur",
  run: async ({ sock, m, args, prefix }) => {
    try {
      const cmdsDir = path.resolve(__dirname);
      const commandFiles = fs.readdirSync(cmdsDir).filter(file => file.endsWith(".js"));
      const commands = commandFiles.map(file => require(path.join(cmdsDir, file)));

      if (args.length === 0) {
        // Show all available commands
        const commandList = commands.map(cmd => `• *${prefix}${cmd.name}* - ${cmd.description}`).join("\n");
        const helpMessage = `📜 *Available Commands:*\n\n${commandList}\n\n💡 Use *${prefix}help [command]* for details.`;
        return await sock.sendMessage(m.key.remoteJid, { text: helpMessage });
      }

      // Show details of a specific command
      const commandName = args[0].toLowerCase();
      const cmd = commands.find(c => c.name === commandName);

      if (!cmd) {
        return await sock.sendMessage(m.key.remoteJid, { text: `❌ Command *${commandName}* not found.` });
      }

      const cmdDetails = `📌 *Command Details:*\n\n` +
        `📛 *Name:* ${cmd.name}\n` +
        `🧑‍💻 *Author:* ${cmd.author || "Unknown"}\n` +
        `🔒 *Permission:* ${cmd.permission}\n` +
        `⏳ *Cooldown:* ${cmd.cooldowns} sec\n` +
        `📜 *Description:* ${cmd.description}`;

      await sock.sendMessage(m.key.remoteJid, { text: cmdDetails });
    } catch (error) {
      console.error("Help Command Error:", error.message);
      await sock.sendMessage(m.key.remoteJid, { text: "❌ Failed to fetch commands. Try again later." });
    }
  },
};