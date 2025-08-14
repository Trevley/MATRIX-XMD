const { franceking } = require('../main');
const axios = require('axios');

module.exports = [
  {
    name: 'serie-a',
    get flashOnly() {
      return franceking();
    },
    description: 'Serie-a command',
    category: 'Sports',
    execute: async (king, msg, args, fromJid) => {
      try {
        const res = await axios.get('https://api.dreaded.site/api/standings/SA');
        const standings = res.data.data;
        const message = `*TABLE STANDINGS FOR SERIE-A*\n\n${standings}`;

        await king.sendMessage(fromJid, {
          text: message,
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
        await king.sendMessage(fromJid, {
          text: '⚠️ Something went wrong. Unable to fetch Serie A standings.',
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
      }
    }
  },

  {
    name: 'tinyurl',
    get flashOnly() {
      return franceking();
    },
    aliases: ['shorturl'],
    description: 'Tinyurl command',
    category: 'General',
    execute: async (king, msg, args, fromJid) => {
      const text = args.join(' ');
      if (!text) {
        return king.sendMessage(fromJid, {
          text: "Please provide a URL to shorten.",
        }, { quoted: msg });
      }

      const urlRegex = /^(http:\/\/|https:\/\/)[^\s/$.?#].[^\s]*$/i;
      if (!urlRegex.test(text)) {
        return king.sendMessage(fromJid, {
          text: "That doesn't appear to be a valid URL.",
        }, { quoted: msg });
      }

      try {
        const res = await axios.get(`https://api.dreaded.site/api/shorten-url?url=${encodeURIComponent(text)}`);
        const data = res.data;

        if (!data || data.status !== 200 || !data.result || !data.result.shortened_url) {
          return king.sendMessage(fromJid, {
            text: "We are sorry, but the URL shortening service didn't respond correctly. Please try again later.",
          }, { quoted: msg });
        }

        const shortenedUrl = data.result.shortened_url;
        const originalUrl = data.result.original_url;

        await king.sendMessage(fromJid, {
          text: `*Shortened URL*: ${shortenedUrl}`,
        }, { quoted: msg });

      } catch (e) {
        console.error("Error occurred:", e);
        await king.sendMessage(fromJid, {
          text: "An error occurred while shortening the URL. Please try again later.",
        }, { quoted: msg });
      }
    }
  },

  {
    name: 'bundesliga',
    get flashOnly() {
      return franceking();
    },
    aliases: ['bl1', 'germany'],
    description: 'Get the current Bundesliga standings.',
    category: 'Sports',
    execute: async (king, msg, args, fromJid) => {
      try {
        const response = await axios.get('https://api.dreaded.site/api/standings/BL1');
        const standings = response.data.data;

        let table;
        if (typeof standings === 'string') {
          table = `🏆 *TABLE STANDINGS FOR BUNDESLIGA*\n\n${standings}`;
        } else if (Array.isArray(standings)) {
          table = '🏆 *TABLE STANDINGS FOR BUNDESLIGA*\n\n';
          standings.forEach((team, index) => {
            table += `*${index + 1}. ${team.team}*\n`;
            table += `   📊 Pts: ${team.points} | P: ${team.played} | W: ${team.win} | D: ${team.draw} | L: ${team.lose} | GD: ${team.goalsDiff}\n\n`;
          });
        } else {
          table = '⚠️ Unexpected data format from API.';
        }

        await king.sendMessage(fromJid, {
          text: table.trim(),
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
        console.error('[BUNDESLIGA ERROR]', err);
        await king.sendMessage(fromJid, {
          text: '⚠️ Something went wrong. Unable to fetch Bundesliga standings.',
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
      }
    }
  },

  {
    name: 'epl',
    get flashOnly() {
      return franceking();
    },
    aliases: ['premierleague', 'pl'],
    description: 'Get the current English Premier League standings.',
    category: 'Sports',
    execute: async (king, msg, args, fromJid) => {
      try {
        const response = await axios.get('https://api.dreaded.site/api/standings/PL');
        const standings = response.data.data;

        let table;
        if (typeof standings === 'string') {
          table = `🏆 *ENGLISH PREMIER LEAGUE STANDINGS*\n\n${standings}`;
        } else if (Array.isArray(standings)) {
          table = '🏆 *ENGLISH PREMIER LEAGUE STANDINGS*\n\n';
          standings.forEach((team, index) => {
            table += `*${index + 1}. ${team.team}*\n`;
            table += `   📊 Pts: ${team.points} | P: ${team.played} | W: ${team.win} | D: ${team.draw} | L: ${team.lose} | GD: ${team.goalsDiff}\n\n`;
          });
        } else {
          table = '⚠️ Unexpected data format from API.';
        }

        await king.sendMessage(fromJid, {
          text: table.trim(),
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
        console.error('[EPL ERROR]', err);
        await king.sendMessage(fromJid, {
          text: '⚠️ Something went wrong. Unable to fetch EPL standings.',
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
      }
    }
  },

  {
    name: 'laliga',
    get flashOnly() {
      return franceking();
    },
    aliases: ['ll', 'spain'],
    description: 'Get the current La Liga standings.',
    category: 'Sports',
    execute: async (king, msg, args, fromJid) => {
      try {
        const response = await axios.get('https://api.dreaded.site/api/standings/PD');
        const standings = response.data.data;

        let table;
        if (typeof standings === 'string') {
          table = `🏆 *LA LIGA TABLE STANDINGS*\n\n${standings}`;
        } else if (Array.isArray(standings)) {
          table = '🏆 *LA LIGA TABLE STANDINGS*\n\n';
          standings.forEach((team, index) => {
            table += `*${index + 1}. ${team.team}*\n`;
            table += `   📊 Pts: ${team.points} | P: ${team.played} | W: ${team.win} | D: ${team.draw} | L: ${team.lose} | GD: ${team.goalsDiff}\n\n`;
          });
        } else {
          table = '⚠️ Unexpected data format from API.';
        }

        await king.sendMessage(fromJid, {
          text: table.trim(),
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
        console.error('[LALIGA ERROR]', err);
        await king.sendMessage(fromJid, {
          text: '⚠️ Something went wrong. Unable to fetch La Liga standings.',
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
      }
    }
  },

  {
    name: 'ligue1',
    get flashOnly() {
      return franceking();
    },
    aliases: ['fl1'],
    description: 'Get the current Ligue 1 standings.',
    category: 'Sports',
    execute: async (king, msg, args, fromJid) => {
      try {
        const response = await axios.get('https://api.dreaded.site/api/standings/FL1');
        const standings = response.data.data;

        let table;
        if (typeof standings === 'string') {
          table = `🏆 *LIGUE 1 TABLE STANDINGS*\n\n${standings}`;
        } else if (Array.isArray(standings)) {
          table = '🏆 *LIGUE 1 TABLE STANDINGS*\n\n';
          standings.forEach((team, index) => {
            table += `*${index + 1}. ${team.team}*\n`;
            table += `   📊 Pts: ${team.points} | P: ${team.played} | W: ${team.win} | D: ${team.draw} | L: ${team.lose} | GD: ${team.goalsDiff}\n\n`;
          });
        } else {
          table = '⚠️ Unexpected data format from API.';
        }

        await king.sendMessage(fromJid, {
          text: table.trim(),
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
        console.error('[LIGUE1 ERROR]', err);
        await king.sendMessage(fromJid, {
          text: '⚠️ Something went wrong. Unable to fetch Ligue 1 standings.',
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
      }
    }
  },

  {
    name: 'matches',
    get flashOnly() {
      return franceking();
    },
    aliases: ['fixtures', 'todaymatches'],
    description: 'Shows today\'s football matches from top leagues.',
    category: 'Sports',
    execute: async (king, msg, args, fromJid) => {
      try {
        const leagues = {
          '🇬🇧 Premier League': 'PL',
          '🇪🇸 La Liga': 'PD',
          '🇩🇪 Bundesliga': 'BL1',
          '🇮🇹 Serie A': 'SA',
          '🇫🇷 Ligue 1': 'FR'
        };

        let message = `⚽ *Today's Football Matches*\n\n`;

        for (const [leagueName, code] of Object.entries(leagues)) {
          const res = await axios.get(`https://api.dreaded.site/api/matches/${code}`);
          const matches = res.data.data;

          if (typeof matches === 'string') {
            message += `${leagueName}:\n${matches}\n\n`;
          } else if (Array.isArray(matches) && matches.length > 0) {
            message += `${leagueName}:\n${matches.map(match => {
              return `${match.game}\n📅 Date: ${match.date}\n⏰ Time: ${match.time} (EAT)\n`;
            }).join('\n')}\n\n`;
          } else {
            message += `${leagueName}: No matches scheduled\n\n`;
          }
        }

        message += '🕒 *Times are in East African Time (EAT).*';

        await king.sendMessage(fromJid, {
          text: message.trim(),
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
        console.error('[MATCHES ERROR]', err);
        await king.sendMessage(fromJid, {
          text: '⚠️ Something went wrong. Unable to fetch matches.',
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
      }
    }
  }
];
