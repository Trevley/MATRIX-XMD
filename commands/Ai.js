
const axios = require('axios');
const vertexAI = require('../france/Gemini');
const { franceking } = require('../main');
const { intelQuery } = require('../france/Deep');

module.exports = [
  {
  name: 'deepseek',
  aliases: ['intel', 'findout'],
  description: 'Conducts an AI-powered investigation and returns summarized insights.',
  category: 'AI',

  get flashOnly() {
    return franceking();
  },

  execute: async (client, msg, args, fromJid) => {
    const inputQuery = args.join(' ').trim();

    if (!inputQuery) {
      return client.sendMessage(fromJid, {
        text: '🕵️ *You need to specify what to investigate.*\nTry: deepseek Bitcoin trends'
      }, { quoted: msg });
    }

    try {
      await client.sendMessage(fromJid, {
        text: '⏳ *Gathering intelligence... please hold on.*'
      }, { quoted: msg });

      const data = await intelQuery(inputQuery);

      const summary = data.summary?.trim() || '_No summary available._';
      const references = data.references?.length
        ? '\n🌍 *References:*\n' + data.references.map((url, idx) => `${idx + 1}. ${url}`).join('\n')
        : '';

      const cost = data.stats?.cost
        ? `\n💰 *Estimated Cost:* $${data.stats.cost.toFixed(2)}`
        : '';

      const agent = data.stats?.engine
        ? `\n🤖 *Agent Type:* ${data.stats.engine}`
        : '';

      const stats = `\n📑 *Pages:* ${data.stats.pages} | 🖼 *Images:* ${data.stats.images}`;

      const messageBody = `🧾 *Intel Report:*\n\n${summary}${references}${cost}${agent}${stats}`;

      const output = messageBody.length > 4000
        ? messageBody.slice(0, 4000) + '…'
        : messageBody;

      await client.sendMessage(fromJid, {
        text: output
      }, { quoted: msg });

    } catch (err) {
      const fallback = [
        '*🚫 Could not complete the investigation.*',
        err.message ? `*Reason:* ${err.message}` : '',
        err.stack ? `*Trace:* ${err.stack}` : ''
      ].filter(Boolean).join('\n\n');

      await client.sendMessage(fromJid, {
        text: fallback
      }, { quoted: msg });
    }
  }
}, 
  {
  name: 'imagine',
  aliases: ['draw', 'generate'],
  description: 'Generate an image using Gemini AI.',
  category: 'AI',

  get flashOnly() {
    return franceking();
  },

  execute: async (king, msg, args, fromJid) => {
    if (!args.length) {
      return king.sendMessage(fromJid, {
        text: '🧠 *What do you want to imagine?*\n\n_Example:_ `.imagine a futuristic city at night`'
      }, { quoted: msg });
    }

    const prompt = args.join(' ');
    const ai = new vertexAI();

    try {
      await king.sendMessage(fromJid, {
        text: '🎨 *Generating image... Please wait.*'
      }, { quoted: msg });

      const predictions = await ai.image(prompt, {
        model: 'imagen-3.0-generate-002',
        aspect_ratio: '9:16'
      });

      const base64 = predictions?.[0]?.bytesBase64Encoded;

      if (!base64) {
        return king.sendMessage(fromJid, {
          text: '⚠️ Sorry, I could not generate the image. Try again later.'
        }, { quoted: msg });
      }

      const imageBuffer = Buffer.from(base64, 'base64');

      await king.sendMessage(fromJid, {
        image: imageBuffer,
        caption: '_✨ Created by Flash-Md-V2_'
      }, { quoted: msg });

    } catch (err) {
      const status = err.response?.status;
      const errorData = err.response?.data;
      const message = err.message;
      const stack = err.stack;

      const errorMsg = [
        '*❌ Error generating image:*',
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
}, 
  {
  name: 'gemini',
  description: 'Ask anything using Gemini AI.',
  category: 'AI',

  get flashOnly() {
    return franceking();
  },

  execute: async (king, msg, args, fromJid) => {
    if (!args.length) {
      return king.sendMessage(fromJid, {
        text: '❓ *Please provide a question or prompt to ask Gemini AI.*'
      }, { quoted: msg });
    }

    const prompt = args.join(' ');
    const ai = new vertexAI();

    try {
      const result = await ai.chat(prompt, {
        model: 'gemini-1.5-flash'
      });

      const aiReply = result?.[0]?.content?.parts?.[0]?.text;

      if (!aiReply) {
        return king.sendMessage(fromJid, {
          text: '⚠️ No response received from Gemini AI.'
        }, { quoted: msg });
      }

      await king.sendMessage(fromJid, {
        text: `💬 *Gemini AI says:*\n\n${aiReply}`
      }, { quoted: msg });

    } catch (err) {
      const status = err.response?.status;
      const errorData = err.response?.data;
      const message = err.message;
      const stack = err.stack;

      const errorMsg = [
        '*❌ Error talking to Gemini:*',
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
}, 
  {
    name: 'llama',
    get flashOnly() {
  return franceking();
},
    aliases: ['ilama'],
    description: 'Ask LLaMA AI a question or prompt.',
    category: 'AI',
    execute: async (sock, msg, args) => {
      const chatId = msg.key.remoteJid;
      if (!args || args.length === 0) {
        return await sock.sendMessage(chatId, { text: "Please provide a question to ask LLaMA." }, { quoted: msg });
      }

      const prompt = args.join(' ');
      const url = `https://api.gurusensei.workers.dev/llama?prompt=${encodeURIComponent(prompt)}`;

      try {
        const { data } = await axios.get(url);
        if (!data?.response?.response) {
          return await sock.sendMessage(chatId, { text: "No response received from LLaMA." }, { quoted: msg });
        }

        const responseText = data.response.response;

        await sock.sendMessage(chatId, {
          text: `*LLaMA says:*\n\n${responseText.trim()}`,
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
      } catch (error) {
        console.error('LLaMA API Error:', error);
        await sock.sendMessage(chatId, { text: "An error occurred while getting a response from LLaMA." }, { quoted: msg });
      }
    }
  },
  {
    name: 'jokes',
    get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Get a random joke.',
    category: 'Fun',
    execute: async (sock, msg, args) => {
      const chatId = msg.key.remoteJid;

      try {
        const response = await fetch('https://api.popcat.xyz/joke');
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();

        await sock.sendMessage(chatId, {
          text: data.joke,
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
      } catch (error) {
        console.error('Error fetching joke:', error.message);
        await sock.sendMessage(chatId, {
          text: '❌ Failed to fetch a joke. Please try again later.'
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'advice',
    get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Get a random piece of advice.',
    category: 'Fun',
    execute: async (sock, msg, args) => {
      const chatId = msg.key.remoteJid;

      try {
        const response = await fetch(`https://api.adviceslip.com/advice`);
        const data = await response.json();
        const quote = data.slip.advice;

        await sock.sendMessage(chatId, {
          text: `*Here is an advice for you:* \n${quote}`,
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
      } catch (error) {
        console.error('Error:', error.message || 'An error occurred');
        await sock.sendMessage(chatId, {
          text: '❌ Oops, an error occurred while processing your request.'
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'trivia',
    get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Get a random trivia question.',
    category: 'Fun',
    execute: async (sock, msg, args) => {
      const chatId = msg.key.remoteJid;

      try {
        const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
        if (!response.ok) throw new Error(`Invalid API response: ${response.status}`);

        const result = await response.json();
        if (!result.results || !result.results[0]) throw new Error('No trivia data received.');

        const trivia = result.results[0];
        const question = trivia.question;
        const correctAnswer = trivia.correct_answer;
        const allAnswers = [...trivia.incorrect_answers, correctAnswer].sort();

        const answers = allAnswers.map((ans, i) => `${i + 1}. ${ans}`).join('\n');

        await sock.sendMessage(chatId, {
          text: `🤔 *Trivia Time!*\n\n${question}\n\n${answers}\n\n_I'll reveal the correct answer in 10 seconds..._`,
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

        setTimeout(async () => {
          await sock.sendMessage(chatId, {
            text: `✅ *Correct Answer:* ${correctAnswer}`,
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
        }, 10000);
      } catch (error) {
        console.error('Trivia Error:', error.message);
        await sock.sendMessage(chatId, {
          text: '❌ Error fetching trivia. Please try again later.'
        }, { quoted: msg });
      }
    }
  },       
  {
    name: 'inspire', 
    get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Get an inspirational quote.',
    category: 'General',
    execute: async (sock, msg, args) => {
      const chatId = msg.key.remoteJid;

      try {
        const response = await fetch(`https://type.fit/api/quotes`);
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.length);
        const quote = data[randomIndex];

        await sock.sendMessage(chatId, {
          text: `✨ *Inspirational Quote:*\n"${quote.text}"\n— ${quote.author || "Unknown"}`,
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
      } catch (error) {
        console.error('Inspire Error:', error.message);
        await sock.sendMessage(chatId, {
          text: '❌ Failed to fetch an inspirational quote.'
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'pair',
    get flashOnly() {
  return franceking();
},
    aliases: ['pairing', 'generatecode'],
    description: 'Generates a pairing code for a phone number.',
    category: 'General',
    execute: async (sock, msg, args) => {
      const chatId = msg.key.remoteJid;
      if (!args || args.length === 0) {
        return await sock.sendMessage(chatId, { text: "Please provide a phone number to generate a pairing code." }, { quoted: msg });
      }

      const number = args.join(' ').trim();
      const url = `https://flash-v2-session.onrender.com/code?number=${encodeURIComponent(number)}`;

      try {
        await sock.sendMessage(chatId, { text: "*FLASH-MD is generating your pairing code...*" }, { quoted: msg });

        const response = await axios.get(url);
        const data = response.data;

        if (!data?.code) {
          return await sock.sendMessage(chatId, { text: "Could not retrieve the pairing code. Please check the number and try again." }, { quoted: msg });
        }

        await sock.sendMessage(chatId, {
          text: `*Pairing Code for ${number} is the digits below ⤵️!*\n\n> *Powered by FLASH-MD*`,
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

        await sock.sendMessage(chatId, {
          text: `\`\`\`${data.code}\`\`\``
        }, { quoted: msg });

      } catch (error) {
        console.error('Pairing Code Error:', error);
        await sock.sendMessage(chatId, { text: "There was an error processing your request. Please try again later." }, { quoted: msg });
      }
    }
  },
  {
    name: 'best-wallp',
    get flashOnly() {
  return franceking();
},
    aliases: ['bestwal', 'best', 'bw'],
    description: 'Sends a high-quality random wallpaper.',
    category: 'FLASH PICS',
    execute: async (sock, msg) => {
      const chatId = msg.key.remoteJid;
      try {
        const { data } = await axios.get('https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc');
        const url = data?.urls?.regular;
        if (!url) {
          return await sock.sendMessage(chatId, { text: "Couldn't fetch wallpaper. Try again later." }, { quoted: msg });
        }
        await sock.sendMessage(chatId, {
          image: { url },
          caption: "*POWERED BY FLASH-MD*",
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
      } catch (error) {
        console.error('Wallpaper Error:', error);
        await sock.sendMessage(chatId, { text: "An error occurred while fetching wallpaper." }, { quoted: msg });
      }
    }
  },
  {
    name: 'random',
    get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Sends a random wallpaper from Unsplash.',
    category: 'FLASH PICS',
    execute: async (sock, msg) => {
      const chatId = msg.key.remoteJid;
      try {
        const { data } = await axios.get('https://api.unsplash.com/photos/random?client_id=72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc');
        const url = data?.urls?.regular;
        if (!url) {
          return await sock.sendMessage(chatId, { text: "Couldn't fetch wallpaper. Try again later." }, { quoted: msg });
        }
        await sock.sendMessage(chatId, {
          image: { url },
          caption: "*POWERED BY FLASH-MD*",
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
      } catch (error) {
        console.error('Random Wallpaper Error:', error);
        await sock.sendMessage(chatId, { text: "An error occurred while fetching random wallpaper." }, { quoted: msg });
      }
    }
  }
];
