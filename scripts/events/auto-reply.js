module.exports = {
    name: 'auto-reply',
    description: 'Automatically replies to common greetings.',
    event: 'chat-update',
    run: async ({ sock, m }) => {
        if (!m.message || !m.key.remoteJid) return;

        const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
        const lowerText = text.toLowerCase();

        const responses = {
            'good morning': ['Good morning! ☀️ Have a great day!', 'Morning! Hope you slept well.'],
            'good night': ['Good night! 🌙 Sleep well!', 'Sweet dreams! 😴'],
            'good evening': ['Good evening! 🌆 How was your day?', 'Hope you’re having a nice evening!'],
            'hello': ['Hello! 👋 How can I help?', 'Hey there! 😊'],
            'hi': ['Hi! 👋 What’s up?', 'Hey! Hope you’re doing well.'],
            'bye': ['Goodbye! See you soon! 👋', 'Take care!'],
            'thank you': ['You’re welcome! 😊', 'No problem!'],
        };

        for (const key in responses) {
            if (lowerText.includes(key)) {
                const reply = responses[key][Math.floor(Math.random() * responses[key].length)];
                return await sock.sendMessage(m.key.remoteJid, { text: reply });
            }
        }
    },
};
