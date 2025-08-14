const { exec } = require('child_process');
const { franceking } = require('../main');

module.exports = [
  {
    name: 'exec',
    get flashOnly() {
      return franceking();
    },
    description: 'Execute shell commands remotely. OWNER ONLY.',
    category: 'OWNER',
    ownerOnly: true,
    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;
      if (!args.length) {
        return king.sendMessage(fromJid, { text: 'Usage: exec <shell command>' }, { quoted: msg });
      }

      const command = args.join(' ');
      king.sendMessage(fromJid, { text: `⚡ Running command:\n${command}` }, { quoted: msg });

      exec(command, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) {
          return king.sendMessage(fromJid, { text: `❌ Error:\n${error.message}` }, { quoted: msg });
        }
        if (stderr) {
          king.sendMessage(fromJid, { text: `⚠️ Stderr:\n${stderr}` }, { quoted: msg });
        }

        const output = stdout.length > 4000 ? stdout.slice(0, 4000) + '...' : stdout;
        king.sendMessage(fromJid, { text: `✅ Output:\n${output || 'No output.'}` }, { quoted: msg });
      });
    }
  }
];
