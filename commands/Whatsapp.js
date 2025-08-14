const { franceking } = require('../main');
const {S_WHATSAPP_NET, downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

const resizeImage = async (imagePath) => {
  const image = await jimp.read(imagePath);
  const resized = image.crop(0, 0, image.getWidth(), image.getHeight()).scaleToFit(720, 720);
  return {
    img: await resized.getBufferAsync(jimp.MIME_JPEG),
    preview: await resized.normalize().getBufferAsync(jimp.MIME_JPEG),
  };
};

async function getBuffer(message, type) {
  const stream = await downloadContentFromMessage(message, type);
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

module.exports = [
  {
  name: "fullpp",
  description: "Set your profile picture without compression (owner only).",
  category: "WhatsApp",
  aliases: ["mypp", "dp"],
  ownerOnly: true,
  get flashOnly() {
    return franceking();
  },

  execute: async (king, msg, args) => {
    const fromJid = msg.key.remoteJid;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const quotedImage = quoted?.imageMessage;

    if (!quotedImage) {
      return king.sendMessage(fromJid, {
        text: "📸 Please *reply to an image* to set it as your profile picture.",
      }, { quoted: msg });
    }

    try {
      const buffer = await getBuffer(quotedImage, "image");
      const mediaPath = path.join(__dirname, "..", "temp", `${Date.now()}.jpg`);
      fs.ensureDirSync(path.dirname(mediaPath));
      fs.writeFileSync(mediaPath, buffer);

      const resized = await resizeImage(mediaPath);

      await king.query({
        tag: "iq",
        attrs: {
          to: S_WHATSAPP_NET,
          type: "set",
          xmlns: "w:profile:picture",
        },
        content: [{
          tag: "picture",
          attrs: { type: "image" },
          content: resized.img,
        }],
      });

      await king.sendMessage(fromJid, {
        text: "✅ Profile picture updated successfully!",
      }, { quoted: msg });

      fs.unlinkSync(mediaPath);

    } catch (err) {
      console.error("[FULLPP ERROR]", err);
      await king.sendMessage(fromJid, {
        text: "❌ Failed to update profile picture.",
      }, { quoted: msg });
    }
  }
}, 

  {
    name: 'privacy',
      get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Displays your current privacy settings.',
    category: 'Whatsapp',
      ownerOnly: true, 
    execute: async (king, msg, args, fromJid) => {
       

        try {
            const {
                readreceipts,
                profile,
                status,
                online,
                last,
                groupadd,
                calladd
            } = await king.fetchPrivacySettings(true);

            const name = king.user?.name || "User";
            const caption = `*Privacy Settings*\n\n` +
                `*Name:* ${name}\n` +
                `*Online:* ${online}\n` +
                `*Profile:* ${profile}\n` +
                `*Last Seen:* ${last}\n` +
                `*Read Receipts:* ${readreceipts}\n` +
                `*Status:* ${status}\n` +
                `*Group Add:* ${groupadd}\n` +
                `*Call Add:* ${calladd}`;

            const avatar = await king.profilePictureUrl(king.user.id, 'image').catch(_ =>
                'https://telegra.ph/file/b34645ca1e3a34f1b3978.jpg'
            );

            await king.sendMessage(fromJid, {
                image: { url: avatar },
                caption
            }, { quoted: msg });

        } catch (err) {
            await king.sendMessage(fromJid, { text: 'Failed to fetch privacy settings.' }, { quoted: msg });
        }
    }
  },
  {
    name: 'pin',
      get flashOnly() {
  return franceking();
},
    description: 'Pin a chat.',
    category: 'Whatsapp',
      ownerOnly: true, 
    execute: async (king, msg, args, fromJid) => {
        try {
            await king.chatModify({ pin: true }, jid);
            await king.sendMessage(fromJid, { text: 'Chat has been pinned.' }, { quoted: msg });
        } catch (err) {
            console.error('Pin error:', err);
            await king.sendMessage(fromJid, { text: 'Failed to pin the chat.' }, { quoted: msg });
        }
    }
  },
  {
    name: 'unpin',
      get flashOnly() {
  return franceking();
},
    description: 'Unpin a chat.',
    category: 'Whatsapp',
      ownerOnly: true, 
    execute: async (king, msg, args, fromJid) => {
        try {
            await king.chatModify({ pin: false }, jid);
            await king.sendMessage(fromJid, { text: 'Chat has been unpinned.' }, { quoted: msg });
        } catch (err) {
            console.error('Unpin error:', err);
            await king.sendMessage(fromJid, { text: 'Failed to unpin the chat.' }, { quoted: msg });
        }
    }
  },
  {
    name: 'star',
      get flashOnly() {
  return franceking();
},
    description: 'Star a quoted message.',
    category: 'Whatsapp',
      ownerOnly: true, 
    execute: async (king, msg, args, fromJid) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
        const fromMe = msg.message?.extendedTextMessage?.contextInfo?.participant === king.user.id;

        if (!quoted) {
            await king.sendMessage(fromJid, { text: 'Please reply to the message you want to star.' }, { quoted: msg });
            return;
        }

        try {
            await king.chatModify({
                star: {
                    messages: [{ id: quoted, fromMe }],
                    star: true
                }
            }, jid);

            await king.sendMessage(fromJid, { text: 'Message has been starred.' }, { quoted: msg });
        } catch (err) {
            console.error('Star error:', err);
            await king.sendMessage(fromJid, { text: 'Failed to star the message.' }, { quoted: msg });
        }
    }
  },
  {
    name: 'unstar',
      get flashOnly() {
  return franceking();
},
    description: 'Unstar a quoted message.',
    category: 'Whatsapp',
      ownerOnly: true, 
    execute: async (king, msg, args, fromJid) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
        const fromMe = msg.message?.extendedTextMessage?.contextInfo?.participant === king.user.id;

        if (!quoted) {
            await king.sendMessage(fromJid, { text: 'Please reply to the message you want to unstar.' }, { quoted: msg });
            return;
        }

        try {
            await king.chatModify({
                star: {
                    messages: [{ id: quoted, fromMe }],
                    star: false
                }
            }, jid);

            await king.sendMessage(fromJid, { text: 'Message has been unstarred.' }, { quoted: msg });
        } catch (err) {
            console.error('Unstar error:', err);
            await king.sendMessage(fromJid, { text: 'Failed to unstar the message.' }, { quoted: msg });
        }
    }
  }, 
  {
    name: 'mydp',
      get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Updates your profile picture privacy setting.',
    category: 'Whatsapp',
      ownerOnly: true, 
    execute: async (king, msg, args, fromJid) => {
        

        
        const options = {
            all: 'Everyone can see your profile photo',
            contacts: 'Only your contacts can see your profile photo',
            contact_blacklist: 'Contacts except some can see your profile photo',
            none: 'No one can see your profile photo'
        };

        const choice = args.join(' ').toLowerCase();

        if (!options[choice]) {
            const help = `*Choose a profile picture privacy setting:*\n\n` +
                Object.entries(options).map(([k, v]) => `- *${k}*: ${v}`).join('\n') +
                `\n\n_Example:_ *mydp contacts*`;
            return king.sendMessage(fromJid, { text: help }, { quoted: msg });
        }

        try {
            await king.updateProfilePicturePrivacy(choice);
            await king.sendMessage(fromJid, { text: `Profile picture privacy updated to *${choice}*.` }, { quoted: msg });
        } catch {
            await king.sendMessage(fromJid, { text: 'Failed to update profile picture privacy.' }, { quoted: msg });
        }
    }
  },
  {
    name: 'mystatus',
      get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Updates your status privacy setting.',
    category: 'Whatsapp',
      ownerOnly: true, 
    execute: async (king, msg, args, fromJid) => {
        

        
        const options = {
            all: 'Everyone can see your status updates',
            contacts: 'Only your contacts can see your status',
            contact_blacklist: 'Contacts except some can see your status',
            none: 'No one can see your status'
        };

        const choice = args.join(' ').toLowerCase();

        if (!options[choice]) {
            const help = `*Choose a status privacy setting:*\n\n` +
                Object.entries(options).map(([k, v]) => `- *${k}*: ${v}`).join('\n') +
                `\n\n_Example:_ *mystatus contact_blacklist*`;
            return king.sendMessage(fromJid, { text: help }, { quoted: msg });
        }

        try {
            await king.updateStatusPrivacy(choice);
            await king.sendMessage(fromJid, { text: `Status privacy updated to *${choice}*.` }, { quoted: msg });
        } catch {
            await king.sendMessage(fromJid, { text: 'Failed to update status privacy.' }, { quoted: msg });
        }
    }
  },
  {
    name: 'groupadd',
      get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Updates who can add you to groups.',
    category: 'Whatsapp',
      ownerOnly: true, 
    execute: async (king, msg, args, fromJid) => {
        
        const options = {
            all: 'Everyone can add you to groups',
            contacts: 'Only contacts can add you to groups',
            contact_blacklist: 'Contacts except some can add you',
            none: 'No one can add you to groups'
        };

        const choice = args.join(' ').toLowerCase();

        if (!options[choice]) {
            const help = `*Choose a group add privacy setting:*\n\n` +
                Object.entries(options).map(([k, v]) => `- *${k}*: ${v}`).join('\n') +
                `\n\n_Example:_ *groupadd contacts*`;
            return king.sendMessage(fromJid, { text: help }, { quoted: msg });
        }

        try {
            await king.updateGroupsAddPrivacy(choice);
            await king.sendMessage(fromJid, { text: `Group add privacy updated to *${choice}*.` }, { quoted: msg });
        } catch {
            await king.sendMessage(fromJid, { text: 'Failed to update group add privacy.' }, { quoted: msg });
        }
    }
  }, 
  {
    name: 'lastseen',
      get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Updates your last seen privacy settings.',
    category: 'Whatsapp',
      ownerOnly: true, 
    execute: async (king, msg, args, fromJid) => {
        

        const availablePrivacies = {
            all: "Everyone can see your last seen",
            contacts: "Only contacts can see your last seen",
            contact_blacklist: "Contacts except blocked ones can see your last seen",
            none: "No one can see your last seen"
        };

        const priv = args.join(' ').toLowerCase();

        if (!priv || !Object.keys(availablePrivacies).includes(priv)) {
            let helpText = `*Choose a valid privacy setting:*\n\n`;
            for (const [key, desc] of Object.entries(availablePrivacies)) {
                helpText += `- *${key}*: ${desc}\n`;
            }
            helpText += `\n_Example:_ *lastseen contacts*`;
            return await king.sendMessage(fromJid, { text: helpText }, { quoted: msg });
        }

        try {
            await king.updateLastSeenPrivacy(priv);
            await king.sendMessage(fromJid, {
                text: `Last seen privacy updated to *${priv}*.\n${availablePrivacies[priv]}`
            }, { quoted: msg });
        } catch (error) {
            console.error('Failed to update last seen:', error);
            await king.sendMessage(fromJid, {
                text: 'An error occurred while updating last seen settings.'
            }, { quoted: msg });
        }
    }
  },
  {
    name: 'myonline',
      get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Updates your online privacy setting.',
    category: 'Whatsapp',
      ownerOnly: true, 
    execute: async (king, msg, args, fromJid) => {
        
        const options = {
            all: "Everyone can see when you're online",
            match_last_seen: "Matches your Last Seen setting"
        };

        const choice = args.join(' ').toLowerCase();

        if (!options[choice]) {
            const help = `*Choose an online privacy setting:*\n\n` +
                Object.entries(options).map(([k, v]) => `- *${k}*: ${v}`).join('\n') +
                `\n\n_Example:_ *myonline match_last_seen*`;
            return king.sendMessage(fromJid, { text: help }, { quoted: msg });
        }

        try {
            await king.updateOnlinePrivacy(choice);
            await king.sendMessage(fromJid, { text: `Online privacy updated to *${choice}*.` }, { quoted: msg });
        } catch (err) {
            await king.sendMessage(fromJid, { text: 'Failed to update online privacy.' }, { quoted: msg });
        }
    }
  }, 

  {
    name: 'onwa',
      get flashOnly() {
  return franceking();
},
    aliases: ["checkid", "checkno"],
    description: 'Checks if a WhatsApp ID exists.',
    category: 'Whatsapp',
    execute: async (king, msg, args, fromJid) => {
        const rawNumber = args[0];
        if (!rawNumber) return await king.sendMessage(fromJid, { text: 'Please provide a valid number.' }, { quoted: msg });

        const number = rawNumber.replace(/[^\d]/g, '');
        if (number.length < 10) {
            return await king.sendMessage(fromJid, { text: 'Please provide a valid phone number with country code.' }, { quoted: msg });
        }

        const waJid = `${number}@s.whatsapp.net`;

        try {
            const [result] = await king.onWhatsApp(waJid);
            const response = result?.exists
                ? `${rawNumber} exists on WhatsApp!`
                : `${rawNumber} does not exist on WhatsApp.`;
            await king.sendMessage(fromJid, { text: response }, { quoted: msg });
        } catch (error) {
            await king.sendMessage(fromJid, { text: 'An error occurred while checking the number.' }, { quoted: msg });
            console.error('checkIdCommand error:', error);
        }
    }
  },
  {
    name: 'bizprofile',
      get flashOnly() {
  return franceking();
},
    aliases: ["bizp"],
    description: 'Fetches business description and category.',
    category: 'Whatsapp',
    execute: async (king, msg, args, fromJid) => {
        const targetJid = args[0] ? `${args[0].replace(/[^0-9]/g, '')}@s.whatsapp.net` : jid;

        try {
            const profile = await king.getBusinessProfile(targetJid);
            const text = `Business Description: ${profile.description || 'N/A'}\nCategory: ${profile.category || 'N/A'}`;
            await king.sendMessage(fromJid, { text }, { quoted: msg });
        } catch {
            await king.sendMessage(fromJid, { text: 'Failed to fetch business profile.' }, { quoted: msg });
        }
    }
  },
  {
    name: 'removedp',
      get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Removes your profile picture.',
    category: 'Whatsapp',
      ownerOnly: true, 
    execute: async (king, msg, args, fromJid) => {
        
        try {
            await king.removeProfilePicture(fromJid);
            await king.sendMessage(fromJid, { text: 'Profile picture removed.' }, { quoted: msg });
        } catch (err) {
            await king.sendMessage(fromJid, { text: 'Failed to remove profile picture.' }, { quoted: msg });
        }
    }
  }, 
 /* {
    name: 'save',
      get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Saves and resends the replied media message.',
    category: 'User',
      ownerOnly: true, 
    execute: async (king, msg, args, fromJid) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted) {
            return king.sendMessage(fromJid, { text: 'Mention the message you want to save.' }, { quoted: msg });
        }

        let forwardMsg;

        try {
            if (quoted.imageMessage) {
                const buffer = await getMediaBuffer(quoted.imageMessage, 'image');
                forwardMsg = {
                    image: buffer,
                    caption: quoted.imageMessage.caption || ''
                };
            } else if (quoted.videoMessage) {
                const buffer = await getMediaBuffer(quoted.videoMessage, 'video');
                forwardMsg = {
                    video: buffer,
                    caption: quoted.videoMessage.caption || ''
                };
            } else if (quoted.audioMessage) {
                const buffer = await getMediaBuffer(quoted.audioMessage, 'audio');
                forwardMsg = {
                    audio: buffer,
                    mimetype: 'audio/mp4'
                };
            } else if (quoted.stickerMessage) {
                const buffer = await getMediaBuffer(quoted.stickerMessage, 'sticker');
                forwardMsg = {
                    sticker: buffer
                };
            } else if (quoted.conversation || quoted.extendedTextMessage?.text) {
                const text = quoted.conversation || quoted.extendedTextMessage.text;
                forwardMsg = { text };
            }

            if (forwardMsg) {
                const botJid = king.user?.id;
                await king.sendMessage(botJid, forwardMsg);
            } else {
                await king.sendMessage(fromJid, { text: 'Unsupported or empty message.' }, { quoted: msg });
            }
        } catch (error) {
            await king.sendMessage(fromJid, { text: 'Failed to save or resend the message.' }, { quoted: msg });
        }
    }
  },*/
  {
    name: 'archive',
        get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Archives the current chat.',
    category: 'Whatsapp',
      ownerOnly: true, 
    execute: async (king, msg, args, fromJid) => {
         

        try {
            const lastMsgInChat = msg;
            await king.chatModify({ archive: true, lastMessages: [lastMsgInChat] }, jid);
            await king.sendMessage(fromJid, { text: 'Chat has been archived successfully.' }, { quoted: msg });
        } catch (error) {
            console.error('Error archiving chat:', error);
            await king.sendMessage(fromJid, { text: 'There was an error while archiving the chat. Please try again.' }, { quoted: msg });
        }
    }
  }, 
 /* {
    name: 'fullpp',
      get flashOnly() {
  return franceking();
},
    aliases: ['setdp'],
    description: 'Sets bot profile picture from a quoted image.',
    category: 'Whatsapp',
      ownerOnly: true, 
    execute: async (king, msg, args, fromJid) => {
      const senderJid = msg.key.participant || msg.key.remoteJid;
      const senderNumber = senderJid.replace(/@.*$/, '').split(':')[0];


      const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quotedMsg?.imageMessage) {
        return await king.sendMessage(fromJid, {
          text: 'Please reply to an image to set as DP.'
        }, { quoted: msg });
      }

      try {
        const buffer = await downloadMediaMessage({ message: quotedMsg }, 'buffer');
        await king.updateProfilePicture(king.user.id, buffer);
        await king.sendMessage(fromJid, { text: 'Profile picture updated.' }, { quoted: msg });
      } catch (err) {
        console.error(err);
        await king.sendMessage(fromJid, { text: 'Failed to update profile picture.' }, { quoted: msg });
      }
    }
  },*/
  {
    name: 'vv',
          get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Reveals view-once images, videos or audios.',
    category: 'User',
    execute: async (king, msg, args, fromJid) => {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quoted) return;

      const viewOnceMedia = quoted.imageMessage?.viewOnce || quoted.videoMessage?.viewOnce || quoted.audioMessage?.viewOnce;
      if (!viewOnceMedia) return;

      try {
        let sendMsg;
        if (quoted.imageMessage) {
          const buffer = await getBuffer(quoted.imageMessage, 'image');
          sendMsg = {
            image: buffer,
            caption: quoted.imageMessage.caption || '*REVEALED BY FLASH-MD*'
          };
        } else if (quoted.videoMessage) {
          const buffer = await getBuffer(quoted.videoMessage, 'video');
          sendMsg = {
            video: buffer,
            caption: quoted.videoMessage.caption || '*REVEALED BY FLASH-MD*'
          };
        } else if (quoted.audioMessage) {
          const buffer = await getBuffer(quoted.audioMessage, 'audio');
          sendMsg = {
            audio: buffer,
            mimetype: 'audio/mp4'
          };
        }

        if (sendMsg) {
          await king.sendMessage(fromJid, sendMsg, { quoted: msg });
        }
      } catch (err) {
        console.error('vv command error:', err);
      }
    }
  },
  {
    name: 'vv2',
          get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Sends the view once media to the bot user ID.',
    category: 'User',
    execute: async (king, msg, args, fromJid) => {
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

      if (!quoted) return;

      const viewOnceImage = quoted.imageMessage?.viewOnce;
      const viewOnceVideo = quoted.videoMessage?.viewOnce;
      const viewOnceAudio = quoted.audioMessage?.viewOnce;

      if (!viewOnceImage && !viewOnceVideo && !viewOnceAudio) return;

      try {
        let sendMsg;

        if (quoted.imageMessage) {
          const buffer = await getBuffer(quoted.imageMessage, 'image');
          sendMsg = {
            image: buffer,
            caption: quoted.imageMessage.caption || '*REVEALED BY FLASH-MD*'
          };
        } else if (quoted.videoMessage) {
          const buffer = await getBuffer(quoted.videoMessage, 'video');
          sendMsg = {
            video: buffer,
            caption: quoted.videoMessage.caption || '*REVEALED BY FLASH-MD*'
          };
        } else if (quoted.audioMessage) {
          const buffer = await getBuffer(quoted.audioMessage, 'audio');
          sendMsg = {
            audio: buffer,
            mimetype: 'audio/mp4'
          };
        }

        if (sendMsg) {
          const botJid = king.user?.id;
          await king.sendMessage(botJid, sendMsg);
        }
      } catch (error) {
        console.error('vv2Command error:', error);
      }
    }
  },
  {
    name: 'details',
          get flashOnly() {
  return franceking();
},
    aliases: [],
    description: 'Displays the full raw quoted message using Baileys structure.',
    category: 'User',
    execute: async (king, msg, args, fromJid) => {
      const context = msg.message?.extendedTextMessage?.contextInfo;
      const quoted = context?.quotedMessage;

      if (!quoted) {
        return king.sendMessage(fromJid, { text: 'Please reply to a message to view its raw details.' }, { quoted: msg });
      }

      try {
        const json = JSON.stringify(quoted, null, 2);
        const parts = json.match(/[\s\S]{1,3500}/g) || [];

        for (const part of parts) {
          await king.sendMessage(fromJid, {
            text: `*FLASH-MD Message Details:*\n\`\`\`\n${part}\n\`\`\``
          }, { quoted: msg });
        }
      } catch (error) {
        await king.sendMessage(fromJid, { text: 'Failed to read quoted message.' }, { quoted: msg });
      }
    }
  },
  {
    name: 'blocklist',
          get flashOnly() {
  return franceking();
},
    aliases: ['blocked'],
    description: 'Shows the list of blocked users.',
    category: 'Whatsapp',
      ownerOnly: true, 

    execute: async (king, msg, args, fromJid) => {
        

        try {
            const blockedJids = await king.fetchBlocklist();
            if (!blockedJids || blockedJids.length === 0) {
                return await king.sendMessage(fromJid, { text: "Your block list is empty." }, { quoted: msg });
            }

            const formattedList = blockedJids.map((b, i) => `${i + 1}. ${b.replace('@s.whatsapp.net', '')}`).join('\n');

            await king.sendMessage(fromJid, {
                text: `*Blocked Contacts:*\n\n${formattedList}`
            }, { quoted: msg });

        } catch (error) {
            console.error('Error fetching block list:', error);
            await king.sendMessage(fromJid, {
                text: 'An error occurred while retrieving the block list.'
            }, { quoted: msg });
        }
    }
  },
  {
    name: 'vcard',
          get flashOnly() {
  return franceking();
},
    aliases: ['card'],
    description: 'Save a contact from a replied message with a custom name.',
    category: 'WhatsApp',

    execute: async (king, msg, args, fromJid) => {
        const quotedContext = msg.message?.extendedTextMessage?.contextInfo;
        const quotedSender = quotedContext?.participant || quotedContext?.remoteJid;

        if (!quotedSender) {
            return await king.sendMessage(fromJid, { text: 'Reply to a user\'s message to save their number.' }, { quoted: msg });
        }

        if (!args[0]) {
            return await king.sendMessage(fromJid, { text: 'Please provide a name for the contact.' }, { quoted: msg });
        }

        const name = args.join(' ');
        const phoneNumber = quotedSender.split('@')[0];

        const vcardString =
            `BEGIN:VCARD\n` +
            `VERSION:3.0\n` +
            `FN:${name}\n` +
            `TEL;type=CELL;type=VOICE;waid=${phoneNumber}:${phoneNumber}\n` +
            `END:VCARD`;

        await king.sendMessage(
            fromJid,
            {
                contacts: {
                    displayName: name,
                    contacts: [{ displayName: name, vcard: vcardString }]
                }
            },
            { quoted: msg }
        );
    }
  },
  {
    name: 'location',
          get flashOnly() {
  return franceking();
},
    aliases: ['loc'],
    description: 'Returns Google Maps link from a replied location message.',
    category: 'WhatsApp',

    execute: async (king, msg, args, fromJid) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const locMsg = quoted?.locationMessage;

        if (!locMsg) {
            return await king.sendMessage(fromJid, { text: 'Reply to a location message to get the map link.' }, { quoted: msg });
        }

        const { degreesLatitude, degreesLongitude } = locMsg;
        const mapUrl = `https://maps.google.com/?q=${degreesLatitude},${degreesLongitude}`;

        await king.sendMessage(fromJid, {
            text: `Live Location: ${mapUrl}`,
            previewType: 0,
            contextInfo: { isForwarded: true }
        }, { quoted: msg });
    }
  }
];
