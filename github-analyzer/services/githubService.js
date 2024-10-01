import { Octokit } from "octokit";
import {octokitConfigs} from '../configs/config.js'

const octokit = new Octokit(octokitConfigs);

export async function genericRequest(url, params){
    try{
        const response = await octokit.request(url, params);
        return response;
    } catch (error) {
        console.error(error);
        console.error(`Errore ${error.status}: ${error.message}`);
        return [];
    }
}

/* Reference calls */

export async function searchPublicRepos(since){
    try{
        const repos = await octokit.request("GET /repositories",
            {
                since: since
            }
        );

        return repos;
    }catch(error){
        console.error(error)
        return [];
    }
}

export async function getRepository(owner, repoName){

}

export async function getRepoCommits(owner, repoName){
    try{
        const commits = await octokit.request("GET /repos/{owner}/{repo}/commits", {
            owner: owner,
            repo: repoName,
            per_page: 100,
            page: 1
        });

        return commits;
    } catch(error) {
        console.error(`Errore ${error.status}: ${error.message}`);
        return [];
    }
}

export async function getRepoIssues(owner, repoName){
    try{
        const issues =  await octokit.request("GET /repos/{owner}/{repo}/issues", {
            owner: owner,
            repo: repoName
        })

        return issues;
    } catch(error) {
        console.error(`Errore ${error.status}: ${error.message}`);
        return [];
    }
}

export async function getRepoPullRequests(owner, repoName){
    try{
        const pullRequests =  await octokit.request("GET /repos/{owner}/{repo}/pulls", {
            owner: owner,
            repo: repoName
        })

        return pullRequests;
    } catch(error) {
        console.error(`Errore ${error.status}: ${error.message}`);
        return [];
    }
}

export async function searchCommitsWithKeyword(owner, repo, keyword) {
    try {
      const query = `${keyword}`;
      const response = await octokit.request('GET /search/commits', {
        q: query,
        per_page: 100,
        sort: 'author-date',  // Ordinare per data dell'autore
        order: 'asc'         // Ordinamento crescente
      });
  
      const commits = response.data;
      return commits;
  
    } catch (error) {
      console.error("Errore durante la ricerca delle commit:", error);
    }
}

/* End of Reference calls */