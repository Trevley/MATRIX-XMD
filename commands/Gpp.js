const { franceking } = require('../main');
const { S_WHATSAPP_NET, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

const resizeImage = async (imagePath) => {
  const image = await jimp.read(imagePath);
  const resized = image.scaleToFit(720, 720); 
  return {
    img: await resized.getBufferAsync(jimp.MIME_JPEG)
  };
};

async function getBuffer(message, type) {
  const stream = await downloadContentFromMessage(message, type);
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

module.exports = [
  {
    name: "fullgpp",
    description: "Set group profile picture without cropping or compression.",
    category: "Group",
    aliases: ["fullgp", "gpp"],
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    get flashOnly() {
      return franceking();
    },

    execute: async (king, msg, args) => {
      const groupId = msg.key.remoteJid;
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const quotedImage = quoted?.imageMessage;

      if (!quotedImage) {
        return king.sendMessage(groupId, {
          text: "📸 Please *reply to an image* to set it as the full group profile picture.",
        }, { quoted: msg });
      }

      try {
        const buffer = await getBuffer(quotedImage, "image");
        const mediaPath = path.join(__dirname, "..", "temp", `${Date.now()}-group.jpg`);
        fs.ensureDirSync(path.dirname(mediaPath));
        fs.writeFileSync(mediaPath, buffer);

        const resized = await resizeImage(mediaPath);

        await king.query({
          tag: "iq",
          attrs: {
            to: S_WHATSAPP_NET,
            target: groupId,
            type: "set",
            xmlns: "w:profile:picture"
          },
          content: [{
            tag: "picture",
            attrs: { type: "image" },
            content: resized.img
          }]
        });

        await king.sendMessage(groupId, {
          text: "✅ Group profile picture updated!",
        }, { quoted: msg });

        fs.unlinkSync(mediaPath);

      } catch (err) {
        console.error("[FULLGPP ERROR]", err);
        await king.sendMessage(groupId, {
          text: "❌ Failed to set full group profile picture.",
        }, { quoted: msg });
      }
    }
  }
];
