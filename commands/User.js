const { franceking } = require('../main');
const { S_WHATSAPP_NET, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const jimp = require('jimp');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

const restrictedJIDs = [
  "254742063632@s.whatsapp.net",
  "254750948696@s.whatsapp.net",
  "254757835036@s.whatsapp.net",
  "254751284190@s.whatsapp.net"
];

function formatJid(input) {
  const cleaned = input.replace(/[^0-9]/g, '');
  return `${cleaned}@s.whatsapp.net`;
}

function isOwner(msg) {
  const sender = msg.key.participant || msg.key.remoteJid;
  return sender === global.KING_ID || [
    '254742063632@s.whatsapp.net',
    '254757835036@s.whatsapp.net'
  ].includes(sender);
}
function getSenderJid(msg) {
  return msg.key.participant || msg.key.remoteJid;
}
let isStatusFetching = false;
let fetchInterval;

module.exports = [
  {
    name: 'block',
    get flashOnly() {
  return franceking();
},
    description: 'Blocks a user on WhatsApp.',
    category: 'USER',
    ownerOnly: true,
    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;
      let targetJid;

      if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
        targetJid = msg.message.extendedTextMessage.contextInfo.participant;
      } else if (args.length > 0) {
        targetJid = args[0].includes('@s.whatsapp.net') ? args[0] : formatJid(args[0]);
      } else if (fromJid.endsWith('@s.whatsapp.net')) {
        targetJid = fromJid;
      } else {
        return king.sendMessage(fromJid, { text: "Please mention or provide a number to block." }, { quoted: msg });
      }

      if (restrictedJIDs.includes(targetJid)) {
        return king.sendMessage(fromJid, { text: "I'm sorry, I cannot block my developer!!" }, { quoted: msg });
      }

      try {
        await king.updateBlockStatus(targetJid, "block");
        await king.sendMessage(fromJid, { text: `✅ Blocked ${targetJid} successfully.` }, { quoted: msg });
      } catch (error) {
        await king.sendMessage(fromJid, { text: "❌ Error occurred while blocking the user." }, { quoted: msg });
      }
    }
  },

  {
    name: 'setbio',
    get flashOnly() {
  return franceking();
},
    description: 'Set a custom bio/status message.',
    category: 'USER',
    ownerOnly: true,
    
    execute: async (king, msg, args) => {
      const jid = msg.key.remoteJid;
      const bioText = args.join(" ");
      if (!bioText) {
        return king.sendMessage(jid, { text: "Please provide a bio to set. Usage: `setbio <your bio>`" }, { quoted: msg });
      }

      try {
        await king.query({
          tag: 'iq',
          attrs: {
            to: S_WHATSAPP_NET,
            type: "set",
            xmlns: "status"
          },
          content: [{
            tag: "status",
            attrs: {},
            content: Buffer.from(bioText, "utf-8")
          }]
        });

        return king.sendMessage(jid, { text: "Bio updated successfully!" }, { quoted: msg });
      } catch (error) {
        console.error("Error updating bio:", error);
        return king.sendMessage(jid, { text: "Failed to update bio. Please try again." }, { quoted: msg });
      }
    }
  },

  {
    name: 'autobio',
    get flashOnly() {
  return franceking();
},
    description: 'Toggle automatic status updates with random facts.',
    category: 'USER',
    ownerOnly: true,

    execute: async (king, msg, args) => {
      const jid = msg.key.remoteJid;
      const command = args[0];

      if (!command) {
        return king.sendMessage(jid, { text: 'Usage: `autobio on` to enable status fetching or `autobio off` to disable it.' }, { quoted: msg });
      }

      if (command === 'on') {
        if (isStatusFetching) {
          return king.sendMessage(jid, { text: 'Auto-Bio is already enabled!' }, { quoted: msg });
        }

        isStatusFetching = true;

        fetchInterval = setInterval(async () => {
          try {
            const response = await fetch('https://nekos.life/api/v2/fact');
            if (!response.ok) throw new Error('Failed to fetch fact');

            const data = await response.json();
            const statusMessage = `FLASH-MD BIO: ${data.fact}`;

            await king.query({
              tag: 'iq',
              attrs: {
                to: S_WHATSAPP_NET,
                type: 'set',
                xmlns: 'status'
              },
              content: [{
                tag: 'status',
                attrs: {},
                content: Buffer.from(statusMessage, 'utf-8')
              }]
            });
          } catch (error) {
            console.error('Error fetching status:', error);
            await king.sendMessage(jid, { text: 'Failed to update status due to an error.' }, { quoted: msg });
          }
        }, 60000);

        return king.sendMessage(jid, { text: "Auto-Bio has been enabled. I'll update your WhatsApp bio every minute." }, { quoted: msg });
      }

      if (command === 'off') {
        if (!isStatusFetching) {
          return king.sendMessage(jid, { text: 'Auto-Bio is already disabled.' }, { quoted: msg });
        }

        clearInterval(fetchInterval);
        isStatusFetching = false;

        return king.sendMessage(jid, { text: 'Status fetching disabled.' }, { quoted: msg });
      }

      return king.sendMessage(jid, { text: 'Usage: `autobio on` to enable status fetching or `autobio off` to disable it.' }, { quoted: msg });
    }
  },
{
    name: 'getpp',
  get flashOnly() {
  return franceking();
},
    description: 'Get the profile picture of a user.',
    category: 'USER',

    execute: async (king, msg, args) => {
      const jid = msg.key.remoteJid;
      const sender = getSenderJid(msg);

      const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const targetJid = msg.message?.extendedTextMessage?.contextInfo?.participant || sender;

      let ppUrl;
      try {
        ppUrl = await king.profilePictureUrl(targetJid, 'image');
      } catch (err) {
        ppUrl = "https://static.animecorner.me/2023/08/op2.jpg";
      }

      const mess = {
        image: { url: ppUrl },
        caption: 'Here is the Profile picture',
        mentions: quotedMsg ? [targetJid] : []
      };

      await king.sendMessage(jid, mess, { quoted: msg });
    }
  },

    {
  name: 'whois',
  get flashOnly() {
    return franceking();
  },
  description: 'Get user profile picture and status.',
  category: 'USER',

  execute: async (king, msg, args) => {
    const jid = msg.key.remoteJid;
    const sender = getSenderJid(msg);

    const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const targetJid = msg.message?.extendedTextMessage?.contextInfo?.participant || sender;

    let ppUrl;
    try {
      ppUrl = await king.profilePictureUrl(targetJid, 'image');
    } catch (err) {
      ppUrl = "https://static.animecorner.me/2023/08/op2.jpg";
    }

    let status = "No status found.";
    let dateText = "";

    try {
      const fetchedStatuses = await king.fetchStatus(targetJid);
      if (Array.isArray(fetchedStatuses) && fetchedStatuses.length > 0) {
        const first = fetchedStatuses[0];
        status = first?.status?.status || "No public status or user has hidden it.";
        if (first?.status?.setAt) {
          const date = new Date(first.status.setAt);
          const formattedDate = date.toLocaleDateString("en-GB"); // DD/MM/YYYY
          dateText = `\n*Set at:* ${formattedDate}`;
        }
      } else {
        status = "No public status or user has hidden it.";
      }
    } catch (err) {
      status = "Couldn't retrieve status due to an error.";
    }

    const mess = {
      image: { url: ppUrl },
      caption: `*Name:* @${targetJid.split("@")[0]}\n*Number:* ${targetJid.replace('@s.whatsapp.net', '')}\n*Status:*\n${status}${dateText}`,
      mentions: quotedMsg ? [targetJid] : []
    };

    await king.sendMessage(jid, mess, { quoted: msg });
  }
}, 
  {
    name: 'mygroups',
    get flashOnly() {
  return franceking();
},
    aliases: ['groups'],
    description: 'Lists all groups the bot is in.',
    category: 'USER',
    ownerOnly: true,

    execute: async (king, msg, args) => {
      const jid = msg.key.remoteJid;
      
try {
      
        const allChats = await king.groupFetchAllParticipating();
        const groups = Object.values(allChats);

        if (!groups.length) {
          return king.sendMessage(jid, { text: "I'm not in any group yet." }, { quoted: msg });
        }

        let groupList = `*GROUPS I AM IN*\n\n`;

        for (let group of groups) {
          groupList += `*Group Name*: ${group.subject}\n`;
          groupList += `*Members*: ${group.participants.length}\n`;
          groupList += `*Group ID*: ${group.id}\n\n`;
        }

        await king.sendMessage(jid, { text: groupList }, { quoted: msg });
      } catch (error) {
        console.error('Error fetching groups:', error);
        await king.sendMessage(jid, { text: 'An error occurred while fetching your groups.' }, { quoted: msg });
      }
    }
  },
 {
  name: 'del',
  get flashOnly() {
    return franceking();
  },
  aliases: ['delete'],
  description: 'Deletes a replied message.',
  category: 'USER',
  ownerOnly: true,

  execute: async (king, msg, args) => {
    const jid = msg.key.remoteJid;

    const quotedMsg = msg.message?.extendedTextMessage?.contextInfo;
    if (!quotedMsg) {
      return king.sendMessage(jid, { text: "Please reply to a message you want to delete." }, { quoted: msg });
    }

    const isGroup = jid.endsWith('@g.us');
    if (isGroup) {
      const metadata = await king.groupMetadata(jid);
      const botId = king.user?.id?.split(':')[0] || '';
      const normalizedBotId = botId.includes('@s.whatsapp.net') ? botId : `${botId}@s.whatsapp.net`;
      const isBotAdmin = metadata.participants.some(p =>
        p.id === normalizedBotId && (p.admin === 'admin' || p.admin === 'superadmin')
      );
    }

    const key = {
      remoteJid: jid,
      id: quotedMsg.stanzaId,
      fromMe: false,
      participant: quotedMsg.participant
    };

    await king.sendMessage(jid, { delete: key });
  }
},
  {
    name: 'restart',
    get flashOnly() {
  return franceking();
},
    aliases: ['reboot'],
    description: 'Restarts the bot.',
    category: 'USER',
    ownerOnly: true,

    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;

      try {
        await king.sendMessage(fromJid, { text: '♻️ Restarting bot... Please wait.' }, { quoted: msg });
        process.exit(0);
      } catch (error) {
        console.error('[ERROR] Restart command failed:', error);
        await king.sendMessage(fromJid, { text: '❌ Failed to restart the bot. Check the logs.' }, { quoted: msg });
      }
    }
  },

  {
    name: 'unblock',
    get flashOnly() {
  return franceking();
},
    description: 'Unblocks a user on WhatsApp.',
    category: 'USER',
    ownerOnly: true,

    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;
      let targetJid;

      if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
        targetJid = msg.message.extendedTextMessage.contextInfo.participant;
      } else if (args.length > 0) {
        targetJid = args[0].includes('@s.whatsapp.net') ? args[0] : formatJid(args[0]);
      } else if (fromJid.endsWith('@s.whatsapp.net')) {
        targetJid = fromJid;
      } else {
        return king.sendMessage(fromJid, { text: "Please mention or provide a number to unblock." }, { quoted: msg });
      }

      if (restrictedJIDs.includes(targetJid)) {
        return king.sendMessage(fromJid, { text: "You cannot unblock the developer using this command." }, { quoted: msg });
      }

      try {
        await king.updateBlockStatus(targetJid, "unblock");
        await king.sendMessage(fromJid, { text: `✅ Unblocked ${targetJid} successfully.` }, { quoted: msg });
      } catch (error) {
        await king.sendMessage(fromJid, { text: "❌ Error occurred while unblocking the user." }, { quoted: msg });
      }
    }
  }
];
  
  
