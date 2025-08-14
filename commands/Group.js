const { franceking } = require('../main');
const conf = require('../config');
const db = require('../db');

module.exports = [
    {
  name: 'info',
  aliases: ['ginfo', 'ginf'],
        category: 'group', 
  groupOnly: true,

  async execute(sock, msg, args, fromJid) {
    try {
      const metadata = await sock.groupMetadata(fromJid);
      const groupName = metadata.subject;
      const groupId = metadata.id;
      const participants = metadata.participants;
      const totalMembers = participants.length;

      const admins = participants.filter(p => p.admin);
      const ownerJid = metadata.owner || (admins.find(p => p.admin === 'superadmin')?.id);
      
      
      async function getDisplayNumber(jid) {
        if (!jid) return 'Unknown';

        if (jid.endsWith('@s.whatsapp.net')) {
          return jid.split('@')[0];
        }

        if (jid.endsWith('@lid')) {
          try {
            const result = await sock.onWhatsApp(jid);
            const waJid = result?.[0]?.jid;
            return waJid ? waJid.split('@')[0] : jid.split('@')[0];
          } catch (err) {
            console.warn('Failed to resolve LID:', jid);
            return jid.split('@')[0];
          }
        }

        return jid.split('@')[0];
      }

      
      const ownerNumber = await getDisplayNumber(ownerJid);

      
      const adminList = await Promise.all(admins.map(async (a, i) => {
        const number = await getDisplayNumber(a.id);
        return `${i + 1}. @${number}`;
      }));

      
      const response = `*📄 Group Information:*\n\n` +
        `📌 *Name:* ${groupName}\n` +
        `🆔 *ID:* ${groupId}\n` +
        `👑 *Owner:* @${ownerNumber}\n` +
        `👥 *Members:* ${totalMembers}\n` +
        `🛡️ *Admins (${admins.length}):*\n${adminList.join('\n')}`;

      
      await sock.sendMessage(fromJid, {
        text: response,
        mentions: [
          ...(ownerJid ? [ownerJid] : []),
          ...admins.map(a => a.id)
        ]
      }, { quoted: msg });

    } catch (err) {
      console.error('❌ Error fetching group info:', err);
      await sock.sendMessage(fromJid, {
        text: '⚠️ Could not fetch group info.'
      }, { quoted: msg });
    }
  }
}, 
    {
  name: 'antilink',
        get flashOnly() {
  return franceking();
},
  description: 'Enable/disable antilink and set action (warn/kick/delete)',
  category: 'Group',
  adminOnly: true,
  botAdminOnly: true,
  ownerOnly: true, 
  groupOnly: true,

  execute: async (king, msg, args) => {
    const fromJid = msg.key.remoteJid;
    const [option, action = 'warn'] = args;

    if (!['on', 'off'].includes(option) || !['warn', 'kick', 'delete'].includes(action)) {
      return king.sendMessage(fromJid, {
        text: `❌ Usage: .antilink on|off warn|kick|delete\n⚙️ Current global warning limit: *${conf.WARN_LIMIT}*`
      }, { quoted: msg });
    }

    const enabled = option === 'on';
    await db.setGroupSettings(fromJid, enabled, action);

    return king.sendMessage(fromJid, {
      text: `✅ Antilink is now *${option.toUpperCase()}* with action: *${action.toUpperCase()}*\n⚠️ Global warning limit: *${conf.WARN_LIMIT}*`
    }, { quoted: msg });
  }
    }, 
{
  name: 'hidetag',
  aliases: ['tag'],
  description: 'Mentions all members in the group using a message or media.',
  category: 'Group',
  get flashOnly() {
    return franceking();
  },
  groupOnly: true,

  execute: async (king, msg, args) => {
    const jid = msg.key.remoteJid;
    const metadata = await king.groupMetadata(jid);
    const tagList = metadata.participants.map(p => p.id);
    const quoted = msg.message?.extendedTextMessage?.contextInfo;

    let outMsg;

    if (quoted?.quotedMessage) {
      const quotedMsg = quoted.quotedMessage;
      const type = Object.keys(quotedMsg)[0];

      switch (type) {
        case 'imageMessage': {
          const buffer = await king.downloadMediaMessage({
            key: {
              remoteJid: jid,
              fromMe: false,
              id: quoted.stanzaId,
              participant: quoted.participant
            },
            message: quotedMsg
          });
          outMsg = {
            image: buffer,
            caption: quotedMsg.imageMessage.caption || '',
            mentions: tagList
          };
          break;
        }

        case 'videoMessage': {
          const buffer = await king.downloadMediaMessage({
            key: {
              remoteJid: jid,
              fromMe: false,
              id: quoted.stanzaId,
              participant: quoted.participant
            },
            message: quotedMsg
          });
          outMsg = {
            video: buffer,
            caption: quotedMsg.videoMessage.caption || '',
            mentions: tagList
          };
          break;
        }

        case 'audioMessage': {
          const buffer = await king.downloadMediaMessage({
            key: {
              remoteJid: jid,
              fromMe: false,
              id: quoted.stanzaId,
              participant: quoted.participant
            },
            message: quotedMsg
          });
          outMsg = {
            audio: buffer,
            mimetype: 'audio/mp4',
            ptt: true,
            mentions: tagList
          };
          break;
        }

        case 'conversation':
        case 'extendedTextMessage': {
          const text = quotedMsg?.conversation || quotedMsg.extendedTextMessage?.text || '👥';
          outMsg = { text, mentions: tagList };
          break;
        }

        default: {
          outMsg = { text: '👥', mentions: tagList };
        }
      }

    } else {
      if (!args || !args.length) {
        await king.sendMessage(jid, {
          text: "❗ Please provide a message or reply to one to mention everyone."
        }, { quoted: msg });
        return;
      }
      outMsg = {
        text: args.join(' '),
        mentions: tagList
      };
    }

    await king.sendMessage(jid, outMsg);
  }
}, 

    {
    name: 'tagall',
        get flashOnly() {
  return franceking();
},
    aliases: ['mentionall'],
    description: 'Mentions all members of the current group.',
    category: 'Group',
    groupOnly: true,

    execute: async (king, msg, args, jid) => {
        try {
            const groupInfo = await king.groupMetadata(jid);
            const participants = groupInfo.participants;

            if (!participants.length) {
                return await king.sendMessage(jid, { text: "⚠️ No participants found in this group." }, { quoted: msg });
            }

            const customText = args.length > 0 ? args.join(' ') : 'Hello everyone!';
            let mentionText = `*📣 ${customText}*\n\n`;
            participants.forEach((p, i) => {
                mentionText += `${i + 1}. @${p.id.split('@')[0]}\n`;
            });

            await king.sendMessage(jid, {
                text: mentionText,
                mentions: participants.map(p => p.id)
            }, { quoted: msg });

        } catch (error) {
            await king.sendMessage(jid, {
                text: '❌ Something went wrong while tagging everyone.'
            }, { quoted: msg });
        }
    }
}, 
    
  {
    name: 'rename',
      get flashOnly() {
  return franceking();
},
    aliases: ['gname'],
    description: 'Change the group subject (name).',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
      ownerOnly: true, 
    botAdminOnly: true,
    execute: async (king, msg, args, fromJid) => {
      const newSubject = args.join(' ');
      if (!newSubject) {
        return king.sendMessage(fromJid, { text: '❗ Provide a new group name.' }, { quoted: msg });
      }

      try {
        await king.groupUpdateSubject(fromJid, newSubject);
        await king.sendMessage(fromJid, { text: `✅ Group name changed to: *${newSubject}*` }, { quoted: msg });
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Failed to change group name.' }, { quoted: msg });
      }
    }
  },
    
  {
    name: 'kick',
      get flashOnly() {
  return franceking();
},
    aliases: ['remove'],
    description: 'Remove a user from the group.',
    category: 'Group',
      ownerOnly: true, 
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async (king, msg, args, fromJid) => {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
      const tagged = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const target = quoted || tagged;

      if (!target) {
        return king.sendMessage(fromJid, { text: '⚠️ Tag or reply to the user you want to remove.' }, { quoted: msg });
      }

      try {
        await king.groupParticipantsUpdate(fromJid, [target], 'remove');
        await king.sendMessage(fromJid, {
          text: `✅ @${target.split('@')[0]} has been removed.`,
          mentions: [target]
        }, { quoted: msg });
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Failed to remove user.' }, { quoted: msg });
      }
    }
  },

  {
    name: 'add',
      get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Add a user to the group.',
    category: 'Group',
      ownerOnly: true, 
    groupOnly: true,
    adminOnly: true,
    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;
      const senderJid = msg.key.participant || fromJid;
      const senderNum = senderJid.replace(/@.*$/, '').split(':')[0];

      if (!args[0]) {
        return king.sendMessage(fromJid, { text: '⚠️ Provide a number to add.' }, { quoted: msg });
      }

      const num = args[0].replace(/\D/g, '');
      const userJid = `${num}@s.whatsapp.net`;

      try {
        await king.groupParticipantsUpdate(fromJid, [userJid], 'add');
        await king.sendMessage(fromJid, { text: `✅ ${num} added to the group.` }, { quoted: msg });
      } catch {
        await king.sendMessage(fromJid, {
          text: '❌ Failed to add user. They may have privacy restrictions.'
        }, { quoted: msg });
      }
    }
  },

  {
    name: 'kickall',
      get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Remove all non-admin members.',
    category: 'Group',
      ownerOnly: true, 
    groupOnly: true,
    adminOnly: true,
    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      const metadata = await king.groupMetadata(fromJid);
      const toKick = metadata.participants.filter(p => !p.admin).map(p => p.id);

      await king.sendMessage(fromJid, { text: '⚠️ Removing all non-admins in 5 seconds...' }, { quoted: msg });
      await new Promise(res => setTimeout(res, 5000));

      for (const id of toKick) {
        await king.groupParticipantsUpdate(fromJid, [id], 'remove');
        await new Promise(res => setTimeout(res, 500));
      }
    }
  },

  {
    name: 'promote',
      get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Promote a member to admin.',
    category: 'Group',
      ownerOnly: true, 
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
      const target = quoted || mentioned;

      if (!target) {
        return king.sendMessage(fromJid, { text: '⚠️ Tag or reply to the user you want to promote.' }, { quoted: msg });
      }

      try {
        await king.groupParticipantsUpdate(fromJid, [target], 'promote');
        await king.sendMessage(fromJid, {
          text: `✅ @${target.split('@')[0]} is now an admin.`,
          mentions: [target]
        }, { quoted: msg });
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Failed to promote user.' }, { quoted: msg });
      }
    }
  },

  {
    name: 'demote',
      get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Demote a group admin.',
    category: 'Group',
      ownerOnly: true, 
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
      const target = quoted || mentioned;

      if (!target) {
        return king.sendMessage(fromJid, { text: '⚠️ Tag or reply to the admin you want to demote.' }, { quoted: msg });
      }

      try {
        await king.groupParticipantsUpdate(fromJid, [target], 'demote');
        await king.sendMessage(fromJid, {
          text: `🛑 @${target.split('@')[0]} has been demoted.`,
          mentions: [target]
        }, { quoted: msg });
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Failed to demote user.' }, { quoted: msg });
      }
    }
  },
{
    name: 'approve',
    get flashOnly() {
  return franceking();
},
    aliases: ['approve-all', 'accept'],
    description: 'Approve all pending join requests.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    ownerOnly: true, 
    botAdminOnly: true,
    reaction: '☑️',
    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      const requests = await king.groupRequestParticipantsList(fromJid);

      if (requests.length === 0) {
        return king.sendMessage(fromJid, { text: '📭 No join requests to approve.' }, { quoted: msg });
      }

      for (const p of requests) {
        await king.groupRequestParticipantsUpdate(fromJid, [p.jid], 'approve');
      }

      await king.sendMessage(fromJid, { text: '✅ All join requests approved.' }, { quoted: msg });
    }
  },

  {
    name: 'reject',
      get flashOnly() {
  return franceking();
},
    aliases: ['rejectall', 'rej', 'reject-all'],
    description: 'Reject all pending join requests.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    reaction: '👻',
    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      const requests = await king.groupRequestParticipantsList(fromJid);

      if (requests.length === 0) {
        return king.sendMessage(fromJid, { text: '📭 No join requests to reject.' }, { quoted: msg });
      }

      for (const p of requests) {
        await king.groupRequestParticipantsUpdate(fromJid, [p.jid], 'reject');
      }

      await king.sendMessage(fromJid, { text: '🚫 All join requests rejected.' }, { quoted: msg });
    }
  },

  {
    name: 'req',
      get flashOnly() {
  return franceking();
},
    description: 'List pending join requests.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    reaction: '☑️',
    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      const requests = await king.groupRequestParticipantsList(fromJid);

      if (!requests.length) {
        return king.sendMessage(fromJid, { text: '📭 No pending join requests.' }, { quoted: msg });
      }

      const list = requests.map(p => '+' + p.jid.split('@')[0]).join('\n');
      await king.sendMessage(fromJid, {
        text: `📥 Pending Requests:\n${list}\n\nUse *approve* or *reject* to respond.`,
      }, { quoted: msg });
    }
  },

  {
    name: 'disap1',
      get flashOnly() {
  return franceking();
},
    description: 'Set disappearing messages to 24 hours.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    reaction: '👻',
    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      try {
        await king.groupToggleEphemeral(fromJid, 86400);
        await king.sendMessage(fromJid, { text: '⏳ Disappearing messages set to 24 hours.' }, { quoted: msg });
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Failed to set disappearing messages.' }, { quoted: msg });
      }
    }
  },

  {
    name: 'disap7',
      get flashOnly() {
  return franceking();
},
    description: 'Set disappearing messages to 7 days.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    reaction: '👻',
    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      try {
        await king.groupToggleEphemeral(fromJid, 7 * 24 * 3600);
        await king.sendMessage(fromJid, { text: '⏳ Disappearing messages set to 7 days.' }, { quoted: msg });
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Failed to set disappearing messages.' }, { quoted: msg });
      }
    }
  },

  {
    name: 'disap90',
      get flashOnly() {
  return franceking();
},
    description: 'Set disappearing messages to 90 days.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    reaction: '👻',
    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      try {
        await king.groupToggleEphemeral(fromJid, 90 * 24 * 3600);
        await king.sendMessage(fromJid, { text: '⏳ Disappearing messages set to 90 days.' }, { quoted: msg });
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Failed to set disappearing messages.' }, { quoted: msg });
      }
    }
  },

  {
    name: 'disap-off',
      get flashOnly() {
  return franceking();
},
    description: 'Turn off disappearing messages.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    reaction: '👻',
    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      try {
        await king.groupToggleEphemeral(fromJid, 0);
        await king.sendMessage(fromJid, { text: '🗑️ Disappearing messages turned off.' }, { quoted: msg });
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Failed to disable disappearing messages.' }, { quoted: msg });
      }
    }
  },

  {
    name: 'disap',
      get flashOnly() {
  return franceking();
},
    description: 'Instructions for disappearing messages.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    reaction: '👻',
    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      await king.sendMessage(fromJid, {
        text: '*Disappearing Message Options*\n\n• *disap1* — 24 hours\n• *disap7* — 7 days\n• *disap90* — 90 days\n• *disap-off* — Disable'
      }, { quoted: msg });
    }
  },

   {
    name: 'desc',
       get flashOnly() {
  return franceking();
},
    aliases: ['gdesc'],
    description: 'Change the group description.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,

    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;
      const newDesc = args.join(' ');

      if (!newDesc) {
        return king.sendMessage(fromJid, { text: '❗ Please provide a new description.' }, { quoted: msg });
      }

      try {
        await king.groupUpdateDescription(fromJid, newDesc);
        await king.sendMessage(fromJid, {
          text: `✅ Group description updated:\n${newDesc}`
        }, { quoted: msg });
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Failed to update group description.' }, { quoted: msg });
      }
    }
  },

  {
    name: 'lock',
      get flashOnly() {
  return franceking();
},
    aliases: ['close'],
    description: 'Only admins can send messages.',
    category: 'Group',
      ownerOnly: true, 
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,

    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      try {
        await king.groupSettingUpdate(fromJid, 'announcement');
        await king.sendMessage(fromJid, { text: '🔒 Group locked. Only admins can message now.' }, { quoted: msg });
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Failed to lock group.' }, { quoted: msg });
      }
    }
  },

  {
    name: 'unlock',
      get flashOnly() {
  return franceking();
},
    aliases: ['open'],
    description: 'Allow all members to send messages.',
    category: 'Group',
    groupOnly: true,
      ownerOnly: true, 
    adminOnly: true,
    botAdminOnly: true,

    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      try {
        await king.groupSettingUpdate(fromJid, 'not_announcement');
        await king.sendMessage(fromJid, { text: '🔓 Group unlocked. All members can message.' }, { quoted: msg });
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Failed to unlock group.' }, { quoted: msg });
      }
    }
  },

  {
    name: 'invite',
      get flashOnly() {
  return franceking();
},
    aliases: ['link'],
    description: 'Get the group invite link.',
    category: 'Group',
    groupOnly: true,
      ownerOnly: true, 
    adminOnly: true,
    botAdminOnly: true,

    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      try {
        const code = await king.groupInviteCode(fromJid);
        await king.sendMessage(fromJid, {
          text: `🔗 Group link:\nhttps://chat.whatsapp.com/${code}`
        }, { quoted: msg });
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Failed to get invite link.' }, { quoted: msg });
      }
    }
  },

  {
    name: 'revoke',
      get flashOnly() {
  return franceking();
},
    aliases: ['reset'],
    description: 'Revoke current invite link and generate new one.',
    category: 'Group',
    groupOnly: true,
      ownerOnly: true, 
    adminOnly: true,
    botAdminOnly: true,

    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      try {
        const newCode = await king.groupRevokeInvite(fromJid);
        await king.sendMessage(fromJid, {
          text: `♻️ New group link:\nhttps://chat.whatsapp.com/${newCode}`
        }, { quoted: msg });
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Failed to generate new link.' }, { quoted: msg });
      }
    }
  },

  {
    name: 'broadcast',
      get flashOnly() {
  return franceking();
},
    aliases: ['bc', 'cast'],
    description: 'Send a broadcast message to all groups.',
    category: 'General',
    reaction: '📢',

    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;
      const message = args.join(' ');

      if (!message) {
        return king.sendMessage(fromJid, { text: '❗ Provide a message to broadcast.' }, { quoted: msg });
      }

      try {
        const groups = await king.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);

        await king.sendMessage(fromJid, { text: '📢 Broadcasting message...' }, { quoted: msg });

        for (const groupId of groupIds) {
          await king.sendMessage(groupId, {
            image: { url: 'https://telegra.ph/file/ee2916cd24336231d8194.jpg' },
            caption: `*📢 Broadcast Message*\n\n${message}`
          });
        }
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Broadcast failed.' }, { quoted: msg });
      }
    }
  },

  {
    name: 'left',
      get flashOnly() {
  return franceking();
},
    aliases: ['leave'],
    description: 'Force the bot to leave the group.',
    category: 'Group',
    groupOnly: true,
    ownerOnly: true, 

    execute: async (king, msg) => {
      const fromJid = msg.key.remoteJid;
      const senderJid = msg.key.participant || msg.key.remoteJid;
      const senderNumber = senderJid.replace(/@.*$/, '').split(':')[0];

      

      try {
        await king.groupLeave(fromJid);
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Failed to leave group.' }, { quoted: msg });
      }
    }
  },

  {
    name: 'create',
      get flashOnly() {
  return franceking();
},
    aliases: ['newgroup', 'newgc'],
    description: 'Create a new group with users.',
    category: 'General',

    execute: async (king, msg, args) => {
      const fromJid = msg.key.remoteJid;

      if (!args.length) {
        return king.sendMessage(fromJid, {
          text: '❗ Provide group name and at least one member.'
        }, { quoted: msg });
      }

      const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const quotedJid = msg.message?.extendedTextMessage?.contextInfo?.participant;
      const [groupName, ...rest] = args;
      const phoneNumbers = rest.filter(n => /^\d+$/.test(n)).map(num => `${num}@s.whatsapp.net`);

      const participants = [...new Set([
        ...mentions,
        ...(quotedJid ? [quotedJid] : []),
        ...phoneNumbers
      ])];

      if (!groupName || participants.length === 0) {
        return king.sendMessage(fromJid, {
          text: 'Usage: .create MyGroup @user or reply or number (e.g. 2547xxxxxxx)'
        }, { quoted: msg });
      }

      try {
        const group = await king.groupCreate(groupName, participants);
        await king.sendMessage(group.id, { text: '👋 Welcome to the new group!' });
      } catch {
        await king.sendMessage(fromJid, { text: '❌ Failed to create group.' }, { quoted: msg });
      }
    }
  }
 ];
    
