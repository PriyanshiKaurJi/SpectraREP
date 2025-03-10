const ytdl = require('@distube/ytdl-core');
const ytSearch = require('yt-search');
const fs = require('fs-extra');
const path = require('path');

const downloadDir = path.join(__dirname, '../../downloads');
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

module.exports = {
    name: 'sing',
    description: 'Search and download audio/video from YouTube',
    permission: 0,
    cooldowns: 5,
    dmUser: true,
    author: 'Priyanshi Kaur',
    run: async ({ sock, m, args }) => {
        if (!args.length) {
            return await sock.sendMessage(m.key.remoteJid, { text: '❌ *Error:* Please provide a search term or YouTube URL.' }, { quoted: m });
        }

        const input = args.join(' ');
        const formatMatch = input.match(/-(audio|video)$/i);
        const format = formatMatch ? formatMatch[1].toLowerCase() : 'audio'; 
        const query = input.replace(/-(audio|video)$/i, '').trim();

        const searchResults = await ytSearch(query);
        if (!searchResults.videos.length) {
            return await sock.sendMessage(m.key.remoteJid, { text: '⚠️ *No results found!* Try a different query.' }, { quoted: m });
        }

        const selectedVideo = searchResults.videos[0];
        const fileExtension = format === 'video' ? 'mp4' : 'mp3';
        const filePath = path.join(downloadDir, `${selectedVideo.videoId}.${fileExtension}`);

        const downloadingMessage = await sock.sendMessage(m.key.remoteJid, { text: `⏳ Downloading ${format === 'video' ? 'video' : 'audio'}...` });

        try {
            const streamOptions = format === 'video' ? {} : { filter: 'audioonly' };
            const stream = ytdl(selectedVideo.url, streamOptions);

            stream.pipe(fs.createWriteStream(filePath)).on('finish', async () => {
                const mediaMessage = format === 'audio'
                    ? {
                        audio: fs.readFileSync(filePath),
                        mimetype: 'audio/mpeg',
                        ptt: false
                    }
                    : {
                        video: fs.readFileSync(filePath),
                        mimetype: 'video/mp4'
                    };

                await sock.sendMessage(m.key.remoteJid, {
                    ...mediaMessage,
                    caption: `🎵 *Title:* ${selectedVideo.title}\n⏱️ *Duration:* ${selectedVideo.timestamp}\n🔗 *YouTube Link:* ${selectedVideo.url}`,
                    contextInfo: {
                        externalAdReply: {
                            title: selectedVideo.title,
                            body: `⏱️ Duration: ${selectedVideo.timestamp}`,
                            thumbnailUrl: selectedVideo.thumbnail,
                            mediaType: 2,
                            mediaUrl: selectedVideo.url,
                            sourceUrl: selectedVideo.url
                        }
                    }
                }, { quoted: m });

                await sock.sendMessage(m.key.remoteJid, { delete: downloadingMessage.key });

                fs.unlinkSync(filePath);
            });

            stream.on('error', async (error) => {
                console.error('Download error:', error);
                await sock.sendMessage(m.key.remoteJid, { text: '❌ *Download Failed!* Please try again later.' }, { quoted: m });
            });

        } catch (error) {
            console.error('Error:', error);
            await sock.sendMessage(m.key.remoteJid, { text: '❌ *Error:* Something went wrong. Try again later.' }, { quoted: m });
        }
    }
};