module.exports = {
  name: 'sudos',
  description: 'View all users with sudo access.',
  category: 'Owner',
  ownerOnly: true,

  async execute(king, msg) {
    const fromJid = msg.key.remoteJid;
    const list = [...global.ALLOWED_USERS];

    if (list.length === 0) {
      return king.sendMessage(fromJid, {
        text: '📭 No sudo users have been added yet.'
      }, { quoted: msg });
    }

    const text = `👑 *Sudo Users List:*\n\n${list.map((n, i) => `${i + 1}. +${n}`).join('\n')}`;

    return king.sendMessage(fromJid, {
      text
    }, { quoted: msg });
  }
};
