const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const vertexAI = require('../france/Gemini');
const { franceking } = require('../main');

module.exports = {
  name: 'vision',
  aliases: ['describe', 'analyze'],
  description: 'Analyze and describe an image using Gemini AI.',
  category: 'AI',

  get flashOnly() {
    return franceking();
  },

  execute: async (king, msg, args, fromJid) => {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted?.imageMessage) {
      return king.sendMessage(fromJid, {
        text: '🖼️ *Reply to an image to analyze it.*'
      }, { quoted: msg });
    }

    try {
      const imageBuffer = await downloadMediaMessage(
        { message: { imageMessage: quoted.imageMessage } },
        'buffer', {}, { logger: console }
      );

      const prompt = args.length ? args.join(' ') : 'Describe the image in detail.';
      const ai = new vertexAI();

      const result = await ai.chat(prompt, {
        model: 'gemini-1.5-flash',
        file_buffer: imageBuffer
      });

      const description = result?.[0]?.content?.parts?.[0]?.text;

      if (!description) {
        return king.sendMessage(fromJid, {
          text: '⚠️ No response received from Gemini AI.'
        }, { quoted: msg });
      }

      await king.sendMessage(fromJid, {
        text: `🧠 *Image Analysis Result:*\n\n${description}`
      }, { quoted: msg });

    } catch (err) {
      const status = err.response?.status;
      const errorData = err.response?.data;
      const message = err.message;
      const stack = err.stack;

      const errorMsg = [
        '*❌ Error analyzing image:*',
        status ? `*Status:* ${status}` : '',
        message ? `*Message:* ${message}` : '',
        errorData ? `*Data:* ${JSON.stringify(errorData, null, 2)}` : '',
        stack ? `*Stack:* ${stack}` : ''
      ].filter(Boolean).join('\n\n');

      // Limit message to 4000 characters for WhatsApp safety
      const trimmedError = errorMsg.length > 4000 ? errorMsg.slice(0, 4000) + '…' : errorMsg;

      await king.sendMessage(fromJid, {
        text: trimmedError
      }, { quoted: msg });
    }
  }
};
