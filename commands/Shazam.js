const acrcloud = require("acrcloud");
const yts = require("yt-search");
const { franceking } = require('../main');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const path = require("path");

ffmpeg.setFfmpegPath(ffmpegPath);

function trimTo15Seconds(inputBuffer, outputPath) {
  return new Promise((resolve, reject) => {
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const inputFile = path.join(tempDir, `input-${Date.now()}.mp4`);
    const outputFile = outputPath;

    fs.writeFileSync(inputFile, inputBuffer);

    ffmpeg(inputFile)
      .setStartTime(0)
      .duration(15)
      .output(outputFile)
      .on('end', () => {
        const trimmed = fs.readFileSync(outputFile);
        fs.unlinkSync(inputFile);
        fs.unlinkSync(outputFile);
        resolve(trimmed);
      })
      .on('error', (err) => reject(err))
      .run();
  });
}

module.exports = {
  name: 'shazam',
  aliases: ['whatsong', 'findsong'],
  description: 'Identify a song from a short audio or video and show details.',
  category: 'Search',

  get flashOnly() {
    return franceking();
  },

  execute: async (king, msg) => {
    const fromJid = msg.key.remoteJid;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted || (!quoted.audioMessage && !quoted.videoMessage)) {
      return king.sendMessage(fromJid, {
        text: '🎵 *Reply to a short audio or video (10–15s) to identify the song.*'
      }, { quoted: msg });
    }

    try {
      const buffer = await downloadMediaMessage(
        { message: quoted },
        'buffer',
        {},
        { logger: console }
      );

      const trimmedBuffer = await trimTo15Seconds(buffer, path.join(__dirname, '..', 'temp', `trimmed-${Date.now()}.mp4`));

      const acr = new acrcloud({
        host: 'identify-ap-southeast-1.acrcloud.com',
        access_key: '26afd4eec96b0f5e5ab16a7e6e05ab37',
        access_secret: 'wXOZIqdMNZmaHJP1YDWVyeQLg579uK2CfY6hWMN8'
      });

      const { status, metadata } = await acr.identify(trimmedBuffer);

      if (status.code !== 0 || !metadata?.music?.length) {
        return king.sendMessage(fromJid, {
          text: '❌ Could not recognize the song. Try again with a clearer 10–15 second clip.'
        }, { quoted: msg });
      }

      const music = metadata.music[0];
      const { title, artists, album, genres, release_date } = music;

      const query = `${title} ${artists?.[0]?.name || ''}`;
      const search = await yts(query);

      let result = `🎶 *Song Identified!*\n`;
      result += `\n🎧 *Title:* ${title}`;
      if (artists) result += `\n👤 *Artist(s):* ${artists.map(a => a.name).join(', ')}`;
      if (album) result += `\n💿 *Album:* ${album.name}`;
      if (genres) result += `\n🎼 *Genre:* ${genres.map(g => g.name).join(', ')}`;
      if (release_date) result += `\n📅 *Released:* ${release_date}`;
      if (search?.videos?.[0]?.url) result += `\n🔗 *YouTube:* ${search.videos[0].url}`;

      return king.sendMessage(fromJid, {
        text: result.trim(),
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
      console.error('[SHZ ERROR]', err);
      return king.sendMessage(fromJid, {
        text: '⚠️ Song not recognizable. Try again with a clearer or shorter clip.'
      }, { quoted: msg });
    }
  }
};
