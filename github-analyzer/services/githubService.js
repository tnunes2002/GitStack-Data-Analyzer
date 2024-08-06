import { Octokit, App } from "octokit";
const octokitConfigs = require('../configs/config.js');

const octokit = new Octokit(octokitConfigs);


async function searchPublicRepos(since){
    try{
        const repos = await octokit.request("GET /repositories",
            {
                since: since
            }
        );

        return repos;
    }catch(error){
        console.error(`Errore ${error.status}: ${error.message}`);
        return [];
    }
}

module.exports = searchPublicRepos;