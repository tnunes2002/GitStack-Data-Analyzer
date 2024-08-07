import { Octokit } from "octokit";
import {octokitConfigs} from '../configs/config.js'

const octokit = new Octokit(octokitConfigs);

export async function genericRequest(url, params){
    try{
        const response = await octokit.request(url, params);
        return response;
    } catch (error) {
        console.error(`Errore ${error.status}: ${error.message}`);
        return [];
    }
}

export async function searchPublicRepos(since){
    try{
        const repos = await octokit.request("GET /repositories",
            {
                since: since
            }
        );

        return repos;
    }catch(error){

    }
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