const { franceking } = require('../main');
const os = require('os');
const moment = require('moment-timezone');
const config = require('../config');

const botStartTime = Date.now();

function detectPlatform() {
    const hostEnv = process.env.HOST_PROVIDER?.toLowerCase();

    const providers = {
        'optiklink': 'Optiklink.com',
        'bot-hosting': 'Bot-Hosting.net',
        'heroku': 'Heroku',
        'railway': 'Railway',
        'koyeb': 'Koyeb',
        'render': 'Render',
        'github': 'GitHub Actions',
        'katabump': 'Katabump.com'
    };

    if (hostEnv && providers[hostEnv]) return providers[hostEnv];
    if (process.env.RAILWAY_STATIC_URL || process.env.RAILWAY_ENVIRONMENT) return 'Railway';
    if (process.env.KOYEB_ENV) return 'Koyeb';
    if (process.env.RENDER) return 'Render';
    if (process.env.GITHUB_WORKFLOW || process.env.GITHUB_ACTIONS) return 'GitHub Actions';
    if (process.env.DYNO) return 'Heroku';

    return 'Unknown (Linux)';
}

function formatUptime(totalSec) {
    const days = Math.floor(totalSec / (3600 * 24));
    const hrs = Math.floor((totalSec % (3600 * 24)) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = Math.floor(totalSec % 60);

    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hrs) parts.push(`${hrs}h`);
    if (mins) parts.push(`${mins}m`);
    if (secs || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(', ');
}

module.exports = {
    name: 'host',
    get flashOnly() {
  return franceking();
},
    aliases: ['platform'],
    description: 'Shows details about the current hosting environment.',
    execute: async (king, msg, args, fromJid) => {
        const platform = detectPlatform();
        const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const usedMem = (totalMem - freeMem).toFixed(2);

        const uptimeBot = formatUptime((Date.now() - botStartTime) / 1000);
        const time = moment().tz(config.timezone).format('HH:mm:ss | DD/MM/YYYY');

        const hostInfo = `*◇ HOSTING STATUS ◇*\n\n` +
                         `*Hosting Provider:* ${platform}\n` +
                         `*Time:* ${time}\n` +
                         `*Bot Uptime:* ${uptimeBot}\n` +
                         `*RAM Used:* ${usedMem} GB\n` +
                         `*Total RAM:* ${totalMem} GB`;

        try {
            await king.sendMessage(fromJid, {
                text: hostInfo,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363238139244263@newsletter',
                        newsletterName: 'FLASH-MD',
                        serverMessageId: -1
                    }
                }
            }, { quoted: msg });
        } catch (error) {
            console.error('Error in host command:', error);
            await king.sendMessage(fromJid, {
                text: `❌ Failed to get host info. Error: ${error.response?.status || error.message}`
            }, { quoted: msg });
        }
    }
};
