const axios = require('axios');
const { franceking } = require('../main');

module.exports = {
  name: 'lyrics',
  description: 'Fetch and display lyrics of a song.',
  category: 'Search',
  get flashOnly() {
    return franceking();
  },
  execute: async (king, msg, args) => {
    const fromJid = msg.key.remoteJid;
    const query = args.join(' ');

    if (!query) {
      return king.sendMessage(fromJid, {
        text: 'Please provide a song name and artist...\nEg: lyrics not afraid Eminem'
      }, { quoted: msg });
    }

    try {
      const apiURL = `https://lyricsapi.fly.dev/api/lyrics?q=${encodeURIComponent(query)}`;
      const res = await axios.get(apiURL);
      const data = res.data;

      if (!data.success || !data.result || !data.result.lyrics) {
        return king.sendMessage(fromJid, {
          text: 'Lyrics not found for the provided query.'
        }, { quoted: msg });
      }

      const { title, artist, image, link, lyrics } = data.result;
      const shortLyrics = lyrics.length > 4096 ? lyrics.slice(0, 4093) + '...' : lyrics;

      const caption =
        `🎶 *FLASH-MD LYRICS!*\n\n` +
        `*Title:* ${title}\n` +
        `*Artist:* ${artist}\n` +
        `*Link:* ${link}\n\n` +
        `📜 *Lyrics:*\n\n` +
        `${shortLyrics}`;

      await king.sendMessage(fromJid, {
        image: { url: image },
        caption,
        contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363238139244263@newsletter',
            newsletterName: 'FLASH-MD',
            serverMessageId: -1
          }
        }
      }, { quoted: msg });

    } catch (err) {
      console.error('[LYRICS ERROR]', err);
      await king.sendMessage(fromJid, {
        text: 'An error occurred while fetching lyrics. Please try again later.'
      }, { quoted: msg });
    }
  }
};
