const { franceking } = require('../main');
const { downloadFromSSSTwitter } = require('../france/x');
const axios = require('axios');

module.exports = {
  name: 'twitter',
  aliases: ['tw', 'twdl'],
  description: 'Download and send Twitter videos directly.',
  category: 'Download',

  get flashOnly() {
    return franceking();
  },

  execute: async (king, msg, args, fromJid) => {
    const url = args[0];

    if (!url || !url.startsWith('https://twitter.com/')) {
      return king.sendMessage(fromJid, {
        text: '🔗 *Please provide a valid Twitter video link.*\n\nExample:\n`!twitter https://twitter.com/username/status/1234567890`'
      }, { quoted: msg });
    }

    try {
      const result = await downloadFromSSSTwitter(url);
      const videoUrl = result.mp4high || result.mp4mid || result.mp4low;

      if (!videoUrl) {
        return king.sendMessage(fromJid, {
          text: '⚠️ No downloadable video link was found.'
        }, { quoted: msg });
      }

      // Download video as buffer
      const videoResponse = await axios.get(videoUrl, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });

      const videoBuffer = Buffer.from(videoResponse.data);

      // Send video with caption
      await king.sendMessage(fromJid, {
        video: videoBuffer,
        caption: '✨ Downloaded by Flash-Md-V2'
      }, { quoted: msg });

    } catch (err) {
      const message = err.message || 'Unknown error';
      const stack = err.stack || '';

      const errorMsg = [
        '*❌ Failed to download Twitter video:*',
        `*Message:* ${message}`,
        `*Stack:* ${stack.slice(0, 1000)}`
      ].join('\n\n');

      await king.sendMessage(fromJid, {
        text: errorMsg
      }, { quoted: msg });
    }
  }
};
