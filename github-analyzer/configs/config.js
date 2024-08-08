import 'dotenv/config';
import constants from './constants.js';

export const octokitConfigs = { 
    auth: process.env.GITHUB_API_AUTHKEY1,
}

export const publicReposApiParams = (since) => {
    return {
        since: since
    }
}

export const commitsApiParams = (owner, repoName) => {
    return {
        owner: owner,
        repo: repoName,
        per_page: constants.API_PERPAGE_ELEMENTS,
    }
}

export const issuesApiParams = (owner, repoName) => {
    return {
        owner: owner,
        repo: repoName,
        per_page: constants.API_PERPAGE_ELEMENTS,
    }
}

export const pullRequestsApiParams = (owner, repoName) => {
    return {
        owner: owner,
        repo: repoName,
        per_page: constants.API_PERPAGE_ELEMENTS,
    }
}