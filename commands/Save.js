const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { franceking } = require('../main');

const tempDir = path.join(__dirname, '..', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

async function saveMedia(msgContent, type = 'file') {
  const buffer = await downloadMediaMessage(msgContent, 'buffer', {}, { logger: console });
  const filename = path.join(tempDir, `${Date.now()}-${type}.bin`);
  fs.writeFileSync(filename, buffer);
  return filename;
}

module.exports = {
  name: 'save',
  description: 'Save and resend a replied message (media/text/sticker).',
  category: 'WhatsApp',
  get flashOnly() {
    return franceking();
  },

  execute: async (king, msg, args) => {
    const recipientJid = king.user.id;
    const myMedia = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!myMedia) {
      return king.sendMessage(recipientJid, {
        text: 'Reply to the message you want to save.'
      }, { quoted: msg });
    }

    let sendMsg;

    try {
      if (myMedia.imageMessage) {
        const mediaPath = await saveMedia({ message: { imageMessage: myMedia.imageMessage } }, 'image');
        sendMsg = {
          image: { url: mediaPath },
          caption: myMedia.imageMessage?.caption ?? ''
        };
      } else if (myMedia.videoMessage) {
        const mediaPath = await saveMedia({ message: { videoMessage: myMedia.videoMessage } }, 'video');
        sendMsg = {
          video: { url: mediaPath },
          caption: myMedia.videoMessage?.caption ?? ''
        };
      } else if (myMedia.audioMessage) {
        const mediaPath = await saveMedia({ message: { audioMessage: myMedia.audioMessage } }, 'audio');
        sendMsg = {
          audio: { url: mediaPath },
          mimetype: 'audio/mp4'
        };
      } else if (myMedia.stickerMessage) {
        const mediaPath = await saveMedia({ message: { stickerMessage: myMedia.stickerMessage } }, 'sticker');
        const sticker = new Sticker(mediaPath, {
          pack: 'FLASH-MD',
          type: StickerTypes.CROPPED,
          categories: ['🔥', '⭐'],
          id: 'flash-md-sticker',
          quality: 70,
          background: 'transparent'
        });
        const stickerBuffer = await sticker.toBuffer();
        sendMsg = { sticker: stickerBuffer };
      } else if (myMedia?.conversation || myMedia?.extendedTextMessage) {
        const textContent = myMedia.conversation || myMedia.extendedTextMessage?.text || 'Saved message';
        sendMsg = { text: textContent };
      } else {
        return king.sendMessage(recipientJid, {
          text: 'Unsupported message type.'
        }, { quoted: msg });
      }

      await king.sendMessage(recipientJid, sendMsg);

      if (sendMsg.image || sendMsg.video || sendMsg.audio) {
        const filePath = sendMsg.image?.url || sendMsg.video?.url || sendMsg.audio?.url;
        try {
          await fs.promises.unlink(filePath);
        } catch (err) {
          console.error('Failed to delete file:', filePath, err);
        }
      }

    } catch (err) {
      console.error('[SAVE COMMAND ERROR]', err);
      await king.sendMessage(recipientJid, {
        text: 'An error occurred while saving the message.'
      }, { quoted: msg });
    }
  }
};

