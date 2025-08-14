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

module.exports = [
  {
    name: 'addvar',
    get flashOnly() {
      return franceking();
    },
    description: 'Adds a new Heroku config variable.',
    category: 'HEROKU',
    ownerOnly: true,
    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;

      const input = args.join(" ");
      if (!input.includes("=")) {
        return king.sendMessage(fromJid, { text: "Invalid format. Usage: addvar VAR_NAME=VALUE" }, { quoted: msg });
      }

      const [varName, varValue] = input.split("=").map(s => s.trim());
      if (!/^[A-Z_]+$/.test(varName)) {
        return king.sendMessage(fromJid, { text: "Variable name must be uppercase." }, { quoted: msg });
      }

      try {
        const { heroku, baseURI } = getHerokuClient();
        await heroku.patch(baseURI + "/config-vars", { body: { [varName]: varValue } });
        await king.sendMessage(fromJid, { text: `Variable *${varName}* added! Restarting...` }, { quoted: msg });
        process.exit(0);
      } catch (e) {
        await king.sendMessage(fromJid, { text: 'Error: ' + e.message }, { quoted: msg });
      }
    }
  },

  {
    name: 'delvar',
    get flashOnly() {
      return franceking();
    },
    description: 'Deletes a Heroku config variable.',
    category: 'HEROKU',
    ownerOnly: true,
    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;

      const varName = args[0];
      if (!varName || !/^[A-Z_]+$/.test(varName)) {
        return king.sendMessage(fromJid, { text: "Provide an uppercase variable name." }, { quoted: msg });
      }

      try {
        const { heroku, baseURI } = getHerokuClient();
        await heroku.patch(baseURI + "/config-vars", { body: { [varName]: null } });
        await king.sendMessage(fromJid, { text: `Variable *${varName}* deleted. Restarting...` }, { quoted: msg });
        process.exit(0);
      } catch (e) {
        await king.sendMessage(fromJid, { text: 'Error: ' + e.message }, { quoted: msg });
      }
    }
  },

  {
    name: 'setvar',
    get flashOnly() {
      return franceking();
    },
    description: 'Updates or sets a Heroku config variable.',
    category: 'HEROKU',
    ownerOnly: true,
    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;

      const input = args.join(" ");
      if (!input.includes("=")) {
        return king.sendMessage(fromJid, { text: "Usage: setvar VAR_NAME=VALUE" }, { quoted: msg });
      }

      const [varName, varValue] = input.split("=").map(s => s.trim());

      try {
        const { heroku, baseURI } = getHerokuClient();
        await heroku.patch(baseURI + "/config-vars", { body: { [varName]: varValue } });
        await king.sendMessage(fromJid, { text: `Variable *${varName}* set. Restarting...` }, { quoted: msg });
        process.exit(0);
      } catch (e) {
        await king.sendMessage(fromJid, { text: 'Error: ' + e.message }, { quoted: msg });
      }
    }
  },

  {
    name: 'getvar',
    get flashOnly() {
      return franceking();
    },
    description: 'Fetches a specific Heroku config variable.',
    category: 'HEROKU',
    ownerOnly: true,
    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;

      const varName = args[0];
      if (!varName) {
        return king.sendMessage(fromJid, { text: "Provide a variable name." }, { quoted: msg });
      }

      try {
        const { heroku, baseURI } = getHerokuClient();
        const vars = await heroku.get(baseURI + "/config-vars");

        if (vars[varName]) {
          king.sendMessage(fromJid, { text: `*${varName}* = ${vars[varName]}` }, { quoted: msg });
        } else {
          king.sendMessage(fromJid, { text: `Variable *${varName}* not found.` }, { quoted: msg });
        }
      } catch (e) {
        king.sendMessage(fromJid, { text: 'Error: ' + e.message }, { quoted: msg });
      }
    }
  },

  {
    name: 'allvar',
    get flashOnly() {
      return franceking();
    },
    description: 'Lists all Heroku environment variables.',
    category: 'HEROKU',
    ownerOnly: true,
    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;

      try {
        const { heroku, baseURI } = getHerokuClient();
        const vars = await heroku.get(baseURI + "/config-vars");

        let reply = '*HEROKU CONFIG VARS*\n\n';
        for (const key in vars) {
          reply += `*${key}* = ${vars[key]}\n`;
        }

        king.sendMessage(fromJid, { text: reply }, { quoted: msg });
      } catch (e) {
        king.sendMessage(fromJid, { text: 'Error: ' + e.message }, { quoted: msg });
      }
    }
  }
];
