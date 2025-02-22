const axios = require('axios');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const cacheFolder = path.resolve(__dirname, './cache');

if (!fs.existsSync(cacheFolder)) {
    fs.mkdirSync(cacheFolder);
}

module.exports = {
    name: 'sing',
    description: 'Search and download audio from YouTube',
    permission: 0,
    cooldowns: 5,
    dmUser: true,
    author: 'Priyanshi Kaur',
    run: async ({ sock, m, args }) => {
        if (!args.length) {
            return m.reply('Please provide a search term or YouTube URL.');
        }

        const query = args.join(' ');
        const searchingMessage = await sock.sendMessage(m.key.remoteJid, { text: 'Searching...' });

        try {
            const searchResults = await yts(query);
            const video = searchResults.videos[0];

            if (!video) {
                await sock.sendMessage(m.key.remoteJid, { text: 'No results found for your query.' });
                return;
            }

            const apiKey = 'priyansh-here';
            const apiUrl = `https://priyansh-ai.onrender.com/youtube?id=${video.videoId}&type=audio&apikey=${apiKey}`;

            const downloadResponse = await axios.get(apiUrl);
            const downloadUrl = downloadResponse.data.downloadUrl;

            const response = await fetch(downloadUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch song. Status code: ${response.status}`);
            }

            const filename = `${video.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
            const downloadPath = path.join(cacheFolder, filename);

            const songBuffer = await response.buffer();
            fs.writeFileSync(downloadPath, songBuffer);

            await sock.sendMessage(m.key.remoteJid, {
                audio: { url: downloadPath },
                mimetype: 'audio/mp4',
                ptt: false
            });

            await m.reply(`🎵 Here is your music:\n\n*Title:* ${video.title}\n*Duration:* ${video.timestamp}\n*YouTube Link:* ${video.url}`);

            await sock.sendMessage(m.key.remoteJid, { delete: searchingMessage.key });

            fs.unlink(downloadPath, (err) => {
                if (err) console.error('Error deleting audio file:', err);
            });

        } catch (error) {
            console.error('Error fetching audio:', error.message);
            await sock.sendMessage(m.key.remoteJid, { text: 'An error occurred. Please try again.' });
        }
    },
};