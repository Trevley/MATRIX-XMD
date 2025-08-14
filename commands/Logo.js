const { franceking } = require('../main');
const mumaker = require('mumaker');

module.exports = [
  {
    name: 'hacker',
    get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Generate a neon hacker-style logo.',
    category: 'Logo',
    execute: async (king, msg, args) => {
      const chatId = msg.key.remoteJid;

      if (!args || args.length === 0) {
        return await king.sendMessage(chatId, { text: 'Example: .hacker YourName' }, { quoted: msg });
      }

      try {
        await king.sendMessage(chatId, { text: '*Generating your logo... Please wait.*' }, { quoted: msg });

        const result = await mumaker.ephoto(
          'https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html',
          args.join(' ')
        );

        await king.sendMessage(chatId, {
          image: { url: result.image },
          caption: '*FLASH-MD V2 - Logo Generator*'
        }, { quoted: msg });

      } catch (error) {
        console.error('Logo generation error:', error);
        await king.sendMessage(chatId, {
          text: 'An error occurred while generating your logo. Please try again later.'
        }, { quoted: msg });
      }
    }
  },

  {
    name: 'dragonball',
    get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Generate a Dragon Ball style logo.',
    category: 'Logo',
    execute: async (king, msg, args) => {
      const chatId = msg.key.remoteJid;
      const noArgMsg = 'Example: .dragonball YourText';

      if (!args || args.length === 0) {
        return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
      }

      try {
        await king.sendMessage(chatId, { text: '*Processing your logo... Please wait.*' }, { quoted: msg });

        const result = await mumaker.ephoto(
          'https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html',
          args.join(' ')
        );

        await king.sendMessage(chatId, {
          image: { url: result.image },
          caption: '*FLASH-MD V2 - Logo Generator*'
        }, { quoted: msg });

      } catch (error) {
        console.error('Logo generation error:', error);
        await king.sendMessage(chatId, {
          text: 'An error occurred while generating your logo. Please try again later.'
        }, { quoted: msg });
      }
    }
  },

  {
    name: 'naruto',
    get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Generate a Naruto Shippuden style logo.',
    category: 'Logo',
    execute: async (king, msg, args) => {
      const chatId = msg.key.remoteJid;
      const noArgMsg = 'Example: .naruto YourText';

      if (!args || args.length === 0) {
        return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
      }

      try {
        await king.sendMessage(chatId, { text: '*Processing your logo... Please wait.*' }, { quoted: msg });

        const result = await mumaker.ephoto(
          'https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html',
          args.join(' ')
        );

        await king.sendMessage(chatId, {
          image: { url: result.image },
          caption: '*FLASH-MD V2 - Logo Generator*'
        }, { quoted: msg });

      } catch (error) {
        console.error('Logo generation error:', error);
        await king.sendMessage(chatId, {
          text: 'An error occurred while generating your logo. Please try again later.'
        }, { quoted: msg });
      }
    }
  },

  {
    name: 'sand',
    get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Generate a sand-style logo.',
    category: 'Logo',
    execute: async (king, msg, args) => {
      const chatId = msg.key.remoteJid;
      const noArgMsg = 'Example: .sand YourText';

      if (!args || args.length === 0) {
        return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
      }

      try {
        const result = await mumaker.ephoto(
          'https://en.ephoto360.com/write-names-and-messages-on-the-sand-online-582.html',
          args.join(' ')
        );

        await king.sendMessage(chatId, {
          image: { url: result.image },
          caption: '*Logo by FLASH-MD V2*'
        }, { quoted: msg });

      } catch (error) {
        console.error('Logo generation error:', error);
        await king.sendMessage(chatId, {
          text: 'An error occurred while generating your logo. Please try again later.'
        }, { quoted: msg });
      }
    }
  },
  {
  name: 'sunset',
    get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate a sunset light text effect.',
  category: 'Logo',
  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = 'Example: .sunset YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/create-sunset-light-text-effects-online-807.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: 'chocolate',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate a chocolate text effect.',
  category: 'Logo',
  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = 'Example: .chocolate YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/chocolate-text-effect-353.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: 'mechanical',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate a mechanical style text effect.',
  category: 'Logo',
  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = 'Example: .mechanical YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/create-your-name-in-a-mechanical-style-306.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
}, 
{
  name: 'rain',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate a foggy rainy text effect.',
  category: 'Logo',
  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .rain YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/foggy-rainy-text-effect-75.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: 'cloth',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate a text on cloth effect.',
  category: 'Logo',
  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .cloth YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/text-on-cloth-effect-62.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: 'water',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate a water effect text logo.',
  category: 'Logo',
  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .water YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/create-water-effect-text-online-295.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: '1917',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate a 1917 movie-style text logo.',
  category: 'Logo',
  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .1917 YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/1917-style-text-effect-523.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
}, 
{
  name: 'graffiti',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate a cartoon-style graffiti text effect.',
  category: 'Logo',

  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .graffiti YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: 'boom',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate a comic-style boom text effect.',
  category: 'Logo',

  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .boom YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/boom-text-comic-style-text-effect-675.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: 'cat',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate handwritten text on foggy glass.',
  category: 'Logo',

  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .cat YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: 'purple',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate a purple text effect.',
  category: 'Logo',

  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .purple YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/purple-text-effect-online-100.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
}, 
{
  name: 'gold',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate a modern gold text effect.',
  category: 'Logo',

  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .gold YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/modern-gold-4-213.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: 'arena',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate Arena of Valor-style cover text.',
  category: 'Logo',

  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .arena YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/create-cover-arena-of-valor-by-mastering-360.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: 'incandescent',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate incandescent bulb text effect.',
  category: 'Logo',

  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .incandescent YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/text-effects-incandescent-bulbs-219.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: 'child',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Write text on wet glass style.',
  category: 'Logo',

  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .child YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
}, 

  {
  name: 'typo',
    get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate typography text on pavement.',
  category: 'Logo',

  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .typo YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/typography-text-effect-on-pavement-online-774.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: 'light',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate futuristic light technology style text.',
  category: 'Logo',

  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .light YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: 'steel',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate dragon steel text effect.',
  category: 'Logo',

  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .steel YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/dragon-steel-text-effect-online-347.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: 'sunlight',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate a sunlight shadow text effect.',
  category: 'Logo',

  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .sunlight YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/sunlight-shadow-text-204.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: 'frozen',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate a frozen Christmas text effect.',
  category: 'Logo',

  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .frozen YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/create-a-frozen-christmas-text-effect-online-792.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
},

{
  name: 'leaves',
  get flashOnly() {
  return franceking();
},
  aliases: [],
  description: 'Generate a green brush text effect.',
  category: 'Logo',

  execute: async (king, msg, args) => {
    const chatId = msg.key.remoteJid;
    const noArgMsg = '*Example:* .leaves YourText';

    if (!args || args.length === 0) {
      return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
    }

    try {
      const result = await mumaker.ephoto(
        'https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html',
        args.join(' ')
      );

      await king.sendMessage(chatId, {
        image: { url: result.image },
        caption: '*Logo by FLASH-MD V2*'
      }, { quoted: msg });

    } catch (error) {
      console.error('Logo generation error:', error);
      await king.sendMessage(chatId, {
        text: 'An error occurred while generating your logo. Please try again later.'
      }, { quoted: msg });
    }
  }
}, 
  
  {
    name: 'night',
    get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Generate a stars-at-night style logo.',
    category: 'Logo',
    execute: async (king, msg, args) => {
      const chatId = msg.key.remoteJid;
      const noArgMsg = 'Example: .night YourText';

      if (!args || args.length === 0) {
        return await king.sendMessage(chatId, { text: noArgMsg }, { quoted: msg });
      }

      try {
        const result = await mumaker.ephoto(
          'https://en.ephoto360.com/stars-night-online-1-85.html',
          args.join(' ')
        );

        await king.sendMessage(chatId, {
          image: { url: result.image },
          caption: '*Logo by FLASH-MD V2*'
        }, { quoted: msg });

      } catch (error) {
        console.error('Logo generation error:', error);
        await king.sendMessage(chatId, {
          text: 'An error occurred while generating your logo. Please try again later.'
        }, { quoted: msg });
      }
    }
  }
];
