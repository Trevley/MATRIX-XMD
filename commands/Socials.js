const axios = require('axios');
const { franceking } = require('../main');

module.exports = [
{
  name: 'google',
  aliases: ['Search'],
  description: 'Search Google and get top results.',
  category: 'Search',

  get flashOnly() {
    return franceking();
  },

  execute: async (king, msg, args, fromJid) => {
    const query = args.join(' ');

    if (!query) {
      return king.sendMessage(fromJid, {
        text: '🔍 *Please provide a search term!*\n\nExample:\n`.google what is treason`'
      }, { quoted: msg });
    }

    try {
      const apiKey = 'AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI'; // Your API key
      const cx = 'baf9bdb0c631236e5'; // Your Search Engine ID

      const { data } = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
        params: {
          q: query,
          key: apiKey,
          cx: cx
        }
      });

      if (!data.items || data.items.length === 0) {
        return king.sendMessage(fromJid, {
          text: '❌ *No results found.*'
        }, { quoted: msg });
      }

      let resultsText = `🌐 *Google Search*\n🔍 *Query:* ${query}\n\n`;

      data.items.slice(0, 5).forEach(item => {
        resultsText += `📌 *Title:* ${item.title}\n📝 *Description:* ${item.snippet}\n🔗 *Link:* ${item.link}\n\n`;
      });

      await king.sendMessage(fromJid, {
        text: resultsText.trim()
      }, { quoted: msg });

    } catch (err) {
      await king.sendMessage(fromJid, {
        text: '⚠️ *Error searching Google.*\nMake sure your API key and CX ID are valid.'
      }, { quoted: msg });
    }
  }
}, {
  name: 'github',
  aliases: ['gh'],
  description: 'Fetch GitHub user profile info.',
  category: 'Search',

  get flashOnly() {
    return franceking();
  },

  execute: async (king, msg, args, fromJid) => {
    const username = args[0];

    if (!username) {
      return king.sendMessage(fromJid, {
        text: '📦 *Please provide a GitHub username.*'
      }, { quoted: msg });
    }

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();

      if (data.message === 'Not Found') {
        return king.sendMessage(fromJid, {
          text: '❌ *GitHub user not found.*'
        }, { quoted: msg });
      }

      const profilePic = `https://github.com/${data.login}.png`;

      const userInfo = `
🌐 *GitHub User Info*

👤 *Name:* ${data.name || 'N/A'}
🔖 *Username:* ${data.login}
📝 *Bio:* ${data.bio || 'N/A'}
🏢 *Company:* ${data.company || 'N/A'}
📍 *Location:* ${data.location || 'N/A'}
📧 *Email:* ${data.email || 'N/A'}
🔗 *Blog:* ${data.blog || 'N/A'}
📂 *Public Repos:* ${data.public_repos}
👥 *Followers:* ${data.followers}
🤝 *Following:* ${data.following}
      `.trim();

      await king.sendMessage(fromJid, {
        image: { url: profilePic },
        caption: userInfo
      }, { quoted: msg });

    } catch (err) {
      await king.sendMessage(fromJid, {
        text: '⚠️ Error fetching GitHub user. Please try again.'
      }, { quoted: msg });
    }
  }
}
];
