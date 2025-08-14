
const { normalizeJid, getUserNumber, isGroupJid } = require('../utils/helpers');
const { saveSudoList } = require('../utils/sudoStore');

module.exports = {
  name: 'sudo',
  description: 'Add, remove, or list users with sudo access.',
  category: 'Owner',
  ownerOnly: true,

  async execute(king, msg, args) {
    const fromJid = msg.key.remoteJid;
    const commandType = args[0]?.toLowerCase();

    if (commandType === 'list') {
      const list = [...global.ALLOWED_USERS];
      if (list.length === 0) {
        return king.sendMessage(fromJid, {
          text: '📭 No sudo users have been added yet.'
        }, { quoted: msg });
      }

      const text = `👑 *Sudo Users List:*\n\n${list.map((n, i) => `${i + 1}. +${n}`).join('\n')}`;
      return king.sendMessage(fromJid, { text }, { quoted: msg });
    }

    const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant ||
                   msg.message?.extendedTextMessage?.contextInfo?.remoteJid;

    if (!quoted) {
      return king.sendMessage(fromJid, {
        text: '❌ Reply to a user to add/remove them.\n\nUsage:\n- sudo add\n- sudo del\n- sudo list'
      }, { quoted: msg });
    }

    const jid = normalizeJid(quoted);
    const number = jid.split('@')[0];

    if (commandType === 'add') {
      global.ALLOWED_USERS.add(number);
      saveSudoList(global.ALLOWED_USERS);
      return king.sendMessage(fromJid, {
        text: `✅ Added +${number} to sudo users.`
      }, { quoted: msg });
    } else if (commandType === 'del') {
      global.ALLOWED_USERS.delete(number);
      saveSudoList(global.ALLOWED_USERS);
      return king.sendMessage(fromJid, {
        text: `❌ Removed +${number} from sudo users.`
      }, { quoted: msg });
    } else {
      return king.sendMessage(fromJid, {
        text: 'Invalid usage.\n\nUsage:\n- sudo add\n- sudo del\n- sudo list'
      }, { quoted: msg });
    }
  }
};
