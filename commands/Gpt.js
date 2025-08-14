const { franceking } = require('../main');
const { xenc01 } = require('../france/Answers');

module.exports = {
  name: 'gpt',
  aliases: ['ask', 'chat'],
  description: 'Chat with GPT model using text prompts.',
  category: 'AI',

  get flashOnly() {
    return franceking(); // Same gating logic
  },

  execute: async (king, msg, args, fromJid) => {
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return king.sendMessage(fromJid, {
        text: '💬 *Please provide a prompt to send to GPT.*\n\nExample:\n`!gpt What is quantum computing?`'
      }, { quoted: msg });
    }

    try {
      const result = await xenc01(prompt);
      const responseText = result.response || '⚠️ No response from GPT.';

      await king.sendMessage(fromJid, {
        text: `🤖 *GPT Response:*\n\n${responseText}`
      }, { quoted: msg });

    } catch (err) {
      const status = err.response?.status;
      const errorData = err.response?.data;
      const message = err.message;
      const stack = err.stack;

      const errorMsg = [
        '*❌ Error calling GPT:*',
        status ? `*Status:* ${status}` : '',
        message ? `*Message:* ${message}` : '',
        errorData ? `*Data:* ${JSON.stringify(errorData, null, 2)}` : '',
        stack ? `*Stack:* ${stack}` : ''
      ].filter(Boolean).join('\n\n');

      const trimmedError = errorMsg.length > 4000 ? errorMsg.slice(0, 4000) + '…' : errorMsg;

      await king.sendMessage(fromJid, {
        text: trimmedError
      }, { quoted: msg });
    }
  }
};
