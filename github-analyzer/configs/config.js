import 'dotenv/config';

export const octokitConfigs = { 
    auth: process.env.GITHUB_API_AUTHKEY,
}

export const commitsApiParams = (owner, repoName) => {
    return {
        owner: owner,
        repo: repoName,
        per_page: 100,
    }
}