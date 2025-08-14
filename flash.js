require('dotenv').config();
const axios = require('axios');

function keepAlive() {
    const url = process.env.ALIVE_URL;

    if (!url) {
        console.error('ALIVE_URL not set in environment variables.');
        return;
    }

    setInterval(() => {
        axios.get(url)
            .then(() => console.log(`Pinged ${url}`))
            .catch(err => console.error('Keep-alive failed:', err.message));
    }, 1000 * 60 * 14);
}

keepAlive();
