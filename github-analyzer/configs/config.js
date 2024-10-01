import 'dotenv/config';
import constants from './constants.js';

export const octokitConfigs = { 
    auth: process.env.GITHUB_API_AUTHKEY,
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

export const searchApiParams = (keyword, startDate, finishDate) => {
    return {
        q: `${keyword} author-date:${startDate}..${finishDate} NOT merge`,
        per_page: constants.API_PERPAGE_ELEMENTS,
        sort: 'author-date',  // Ordinare per data dell'autore
        order: 'asc'  // Ordinamento crescente
    }
};

export const searchApiParamsPage = (keyword, page) => {
    return {
        q: `${keyword}`,
        per_page: 100,
        page: page,
        sort: 'author-date',
        order: 'desc'
      }
}

export const searchApiParamsIssues = (keyword, startDate) => {
    return {
        q: `${keyword} in:title,body created:>=${startDate}`,
        per_page: 100,
        sort: 'created',
        order: 'asc'
    }
}

export const searchRepoApiParams = (owner, repoName) => {
    return {
        owner: owner,
        repo: repoName,
    }
}