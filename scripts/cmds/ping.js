module.exports = {
    name: "ping",
    aliases: ["p", "latency"],
    permission: 0, // 0 = Everyone, 1 = Admins, 2 = Owner
    cooldown: 5,

    run: async ({ sock, m, args, sender, botNumber }) => {
        try {
            const startTime = Date.now();

            // Check user permissions
            const isOwner = global.owner.includes(sender);
            const isAdmin = m.key.remoteJid.endsWith('@g.us') && m.participant ? 
                await sock.groupMetadata(m.key.remoteJid).then(meta => meta.participants.find(p => p.id === sender)?.admin) : false;

            if (module.exports.permission === 2 && !isOwner) {
                return await sock.sendMessage(m.key.remoteJid, { text: "🚫 Only the bot owner can use this command." }, { quoted: m });
            }
            if (module.exports.permission === 1 && !isAdmin && !isOwner) {
                return await sock.sendMessage(m.key.remoteJid, { text: "🛑 Only admins can use this command!" }, { quoted: m });
            }

            // Send the initial "Pinging..." message
            const response = await sock.sendMessage(m.key.remoteJid, { text: "🏓 Pinging..." }, { quoted: m });

            // Calculate latency
            const latency = Date.now() - startTime;

            // Edit the message to show actual latency
            await sock.sendMessage(m.key.remoteJid, { 
                edit: response.key, // Edit the previous message
                text: `🏓 Pong! Latency: *${latency}ms*`
            });

            // Log usage
            console.log(`[PING CMD] User: ${sender}, Latency: ${latency}ms`);

        } catch (error) {
            console.error(`Error in ping command: ${error.message}`);
            await sock.sendMessage(m.key.remoteJid, { text: "⚠️ An error occurred while executing the command." }, { quoted: m });
        }
    }
};