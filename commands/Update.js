const { franceking } = require('../main');
const axios = require('axios');

const { HEROKU_API_KEY, HEROKU_APP_NAME } = process.env;

module.exports = [
  {
    name: 'update',
    get flashOnly() {
      return franceking();
    },
    description: 'Check for new GitHub commits and optionally trigger update.',
    category: 'HEROKU',
    ownerOnly: true,

    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;

      if (!HEROKU_API_KEY || !HEROKU_APP_NAME) {
        return king.sendMessage(fromJid, {
          text: '⚠️ HEROKU_API_KEY or HEROKU_APP_NAME is not set in environment.'
        }, { quoted: msg });
      }

      const subcommand = args[0]?.toLowerCase();

      try {
        if (subcommand === 'now') {
          await king.sendMessage(fromJid, {
            text: '🚀 Updating bot now. Please wait 1-2 minutes...'
          }, { quoted: msg });

          await axios.post(
            `https://api.heroku.com/apps/${HEROKU_APP_NAME}/builds`,
            {
              source_blob: {
                url: 'https://github.com/franceking1/Flash-Md-V2/tarball/main'
              }
            },
            {
              headers: {
                Authorization: `Bearer ${HEROKU_API_KEY}`,
                Accept: 'application/vnd.heroku+json; version=3',
                'Content-Type': 'application/json'
              }
            }
          );

          return king.sendMessage(fromJid, {
            text: '✅ Redeploy triggered successfully!'
          }, { quoted: msg });

        } else {
          const githubRes = await axios.get(
            'https://api.github.com/repos/franceking1/Flash-Md-V2/commits/main'
          );
          const latestCommit = githubRes.data;
          const latestSha = latestCommit.sha;

          const herokuRes = await axios.get(
            `https://api.heroku.com/apps/${HEROKU_APP_NAME}/builds`,
            {
              headers: {
                Authorization: `Bearer ${HEROKU_API_KEY}`,
                Accept: 'application/vnd.heroku+json; version=3'
              }
            }
          );

          const lastBuild = herokuRes.data[0];
          const deployedSha = lastBuild?.source_blob?.url || '';
          const alreadyDeployed = deployedSha.includes(latestSha);

          if (alreadyDeployed) {
            return king.sendMessage(fromJid, {
              text: '✅ Bot is already up to date with the latest commit.'
            }, { quoted: msg });
          }

          return king.sendMessage(fromJid, {
            text: `🆕 New commit found!\n\n*Message:* ${latestCommit.commit.message}\n*Author:* ${latestCommit.commit.author.name}\n\nType *update now* to update your bot.`
          }, { quoted: msg });
        }
      } catch (error) {
        const errMsg = error.response?.data?.message || error.message;
        console.error('Update failed:', errMsg);
        return king.sendMessage(fromJid, {
          text: `❌ Error: ${errMsg}`
        }, { quoted: msg });
      }
    }
  }
];
