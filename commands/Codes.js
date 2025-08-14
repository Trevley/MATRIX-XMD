const fs = require('fs');
const path = require('path');
const { franceking } = require('../main');

module.exports = [
  {
    name: 'cmd',
    aliases: ['getcode'], 
    get flashOnly() {
      return franceking();
    },
    description: 'Sends the JavaScript file where a command is defined.',
    category: 'User',
    ownerOnly: true,
    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;
      const commandName = args[0];

      if (!commandName) {
        return king.sendMessage(fromJid, { text: '❗ Usage: cmd <commandName>' }, { quoted: msg });
      }

      const commandsDir = __dirname; 
      const files = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
      let foundFile = null;

      for (const file of files) {
        const filePath = path.join(commandsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        
        const regex = new RegExp(`name\\s*:\\s*['"\`]${commandName}['"\`]`, 'i');
        if (regex.test(fileContent)) {
          foundFile = filePath;
          break;
        }
      }

      if (!foundFile) {
        return king.sendMessage(fromJid, { text: `❌ Command *${commandName}* not found.` }, { quoted: msg });
      }

      
      try {
        await king.sendMessage(fromJid, {
          document: fs.readFileSync(foundFile),
          fileName: path.basename(foundFile),
          mimetype: 'application/javascript'
        }, { quoted: msg });
      } catch (err) {
        await king.sendMessage(fromJid, { text: `❌ Error: ${err.message}` }, { quoted: msg });
      }
    }
  }
];
