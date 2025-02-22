const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const IMGUR_ACCESS_TOKEN = "053d1e88a4339a154bbeadbfaa4fe6b654e2ef44";

module.exports = {
    name: 'imgur',
    description: 'Upload an image to Imgur and get the direct link',
    permission: 0,
    cooldowns: 5,
    dmUser: true,
    author: 'Priyanshi Kaur',
    run: async ({ sock, m, args }) => {
        if (!m.message.imageMessage) {
            return m.reply('Please reply to an image to upload.');
        }

        const mediaMessage = await sock.downloadMediaMessage(m.message.imageMessage);
        if (!mediaMessage) {
            return m.reply('Failed to download the image.');
        }

        const tempFilePath = path.resolve(__dirname, `./cache/${Date.now()}.jpg`);
        fs.writeFileSync(tempFilePath, mediaMessage);

        try {
            const form = new FormData();
            form.append('image', fs.createReadStream(tempFilePath));

            const imgurResponse = await axios.post("https://api.imgur.com/3/upload", form, {
                headers: {
                    Authorization: `Bearer ${IMGUR_ACCESS_TOKEN}`,
                    ...form.getHeaders(),
                },
            });

            const imgUrl = imgurResponse.data.data.link;
            await sock.sendMessage(m.key.remoteJid, { text: `✅ Image uploaded successfully!\n🔗 Link: ${imgUrl}` });

            fs.unlinkSync(tempFilePath);
        } catch (error) {
            console.error('Imgur Upload Error:', error.message);
            await sock.sendMessage(m.key.remoteJid, { text: 'Failed to upload the image. Please try again later.' });
        }
    },
};