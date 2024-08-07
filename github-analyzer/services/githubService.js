import { Octokit, App } from "octokit";
import octokitConfigs from '../configs/config.js'

const octokit = new Octokit(octokitConfigs);


export default async function searchPublicRepos(since){
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