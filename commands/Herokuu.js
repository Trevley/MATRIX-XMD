const { franceking } = require('../main');
const Heroku = require('heroku-client');

function getHerokuClient() {
  const apiKey = process.env.HEROKU_API_KEY;
  const appName = process.env.HEROKU_APP_NAME;

  if (!apiKey || !appName) {
    throw new Error('Missing HEROKU_API_KEY or HEROKU_APP_NAME in environment variables.');
  }

  return {
    heroku: new Heroku({ token: apiKey }),
    baseURI: `/apps/${appName}`
  };
}

function createHerokuCommand({ name, varName, allowedValues, description }) {
  return {
    name,
    get flashOnly() {
      return franceking();
    },
    description,
    category: 'HEROKU',
    ownerOnly: true,
    execute: async (king, msg, args, fromJid) => {
      const input = args.join(" ").trim();

      if (!input.includes('=')) {
        return king.sendMessage(fromJid, {
          text: `Usage: ${name} = value`
        }, { quoted: msg });
      }

      const [key, valueRaw] = input.split('=');
      const value = valueRaw.trim();

      if (allowedValues && !allowedValues.includes(value.toLowerCase())) {
        return king.sendMessage(fromJid, {
          text: `❌ Invalid value for *${name}*.\nAllowed: ${allowedValues.join(', ')}`
        }, { quoted: msg });
      }

      try {
        const { heroku, baseURI } = getHerokuClient();
        await heroku.patch(baseURI + "/config-vars", {
          body: { [varName]: value }
        });

        await king.sendMessage(fromJid, {
          text: `✅ *${varName}* updated to *${value}*.\nRestarting bot...`
        }, { quoted: msg });

        process.exit(0);
      } catch (e) {
        await king.sendMessage(fromJid, {
          text: '❌ Error: ' + e.message
        }, { quoted: msg });
      }
    }
  };
}

module.exports = [
  createHerokuCommand({
    name: 'mode',
    varName: 'MODE',
    allowedValues: ['private', 'public'],
    description: 'Set bot mode (private/public)'
  }),
  createHerokuCommand({
    name: 'prefix',
    varName: 'PREFIX',
    allowedValues: null,
    description: 'Set command prefix(es), e.g. ! or !,+'
  }),
  createHerokuCommand({
    name: 'timezone',
    varName: 'timezone',
    allowedValues: null,
    description: 'Set timezone (e.g. Africa/Nairobi)'
  }),
  createHerokuCommand({
    name: 'anticall',
    varName: 'ANTICALL',
    allowedValues: ['on', 'off'],
    description: 'Enable or disable AntiCall'
  }),
  createHerokuCommand({
    name: 'antidelete',
    varName: 'ANTIDELETE',
    allowedValues: ['on', 'off'],
    description: 'Enable or disable AntiDelete'
  }),
  createHerokuCommand({
    name: 'autoview',
    varName: 'AUTO_READ_STATUS',
    allowedValues: ['on', 'off'],
    description: 'Enable or disable Auto View Status'
  }),
  createHerokuCommand({
    name: 'autoread',
    varName: 'AUTO_READ_DM',
    allowedValues: ['on', 'off'],
    description: 'Enable or disable Auto Read DMs'
  }),
  createHerokuCommand({
    name: 'autolike',
    varName: 'AUTO_LIKE',
    allowedValues: ['on', 'off'],
    description: 'Enable or disable Auto Like'
  }),
  createHerokuCommand({
    name: 'presence',
    varName: 'PRESENCE_DM',
    allowedValues: ['typing', 'recording', 'online', 'paused'],
    description: 'Set presence for DMs'
  }),
  createHerokuCommand({
    name: 'presencegroup',
    varName: 'PRESENCE_GROUP',
    allowedValues: ['typing', 'recording', 'online', 'paused'],
    description: 'Set presence for Groups'
  })
];
