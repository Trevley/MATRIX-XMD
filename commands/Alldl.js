const axios = require('axios');
const { franceking } = require('../main');

const BASE_URL = 'https://www.noobs-api.rf.gd';

module.exports = {
  name: 'alldl',
  get flashOnly() {
    return franceking();
  },
  aliases: ['alldown', 'dl', 'download'],
  description: 'Download media from various social platforms.',
  category: 'Download',

  execute: async (king, msg, args, jid) => {
    if (!args || args.length === 0) {
      return await king.sendMessage(jid, { text: '🔗 *Please provide a URL to download from.*' }, { quoted: msg });
    }

    const url = args.join(' ');

    try {
      const response = await axios.get(`${BASE_URL}/dipto/alldl?url=${encodeURIComponent(url)}`);
      const data = response.data;

      if (data.result) {
        const isImage = data.result.endsWith('.jpg') || data.result.endsWith('.png');
        const caption = `*FLASH-MD V2*\n🔗 Downloaded from: ${url}`;

        const messageContent = {
          caption,
          contextInfo: {
            externalAdReply: {
              title: "FLASH-MD V2 - Media Downloader",
              body: "Fast & Reliable Downloader",
              mediaType: 1,
              thumbnailUrl: data.imageUrl || '',
              sourceUrl: url,
              renderLargerThumbnail: false,
              showAdAttribution: true
            }
          }
        };

        if (isImage) {
          messageContent.image = { url: data.result };
        } else {
          messageContent.video = { url: data.result };
        }

        await king.sendMessage(jid, messageContent, { quoted: msg });
        await king.sendMessage(jid, { text: '✅ *Download complete!*' }, { quoted: msg });
      } else {
        await king.sendMessage(jid, { text: '❌ No media found or invalid URL.' }, { quoted: msg });
      }
    } catch (error) {
      console.error('[ALLDL ERROR]', error);
      await king.sendMessage(jid, { text: '⚠️ An error occurred while processing your request.' }, { quoted: msg });
    }
  }
};
