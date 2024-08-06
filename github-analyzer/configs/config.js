import 'dotenv/config';

const octokitConfigs = { 
    auth: process.env.GITHUB_API_AUTHKEY,
}

module.exports = octokitConfigs;