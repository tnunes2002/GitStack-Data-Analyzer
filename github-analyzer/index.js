import { Octokit, App } from "octokit";
import 'dotenv/config';
import * as fs from 'fs';

const octokit = new Octokit({ 
    auth: process.env.GITHUB_API_AUTHKEY,});


const repos = await octokit.request("GET /repositories");


var count = 0;
repos.data.forEach(async repo => {
    const owner = repo.owner.login;
    const repoName = repo.name;

    console.log(owner + " " + repoName)

    const commits = await octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner: owner,
        repo: repoName
    })

    const pullRequests =  await octokit.request("GET /repos/{owner}/{repo}/pulls", {
        owner: owner,
        repo: repoName
    })

    const issues =  await octokit.request("GET /repos/{owner}/{repo}/issues", {
        owner: owner,
        repo: repoName
    })
    
    writeCommitsToFile(commits.data, "commits.txt");
    writeIssuesToFile(issues.data, "issues.txt");
    writePullRequestsToFile(pullRequests.data, "pullRequets.txt");
});

// Funzione per scrivere su file
function writeCommitsToFile(commits, filePath) {
    const commitMessages = commits.map(commit => commit.commit.message  + " " + commit.commit.author).join('\n');
    fs.appendFileSync(filePath, commitMessages, 'utf8');
}

function writeIssuesToFile(issues, filePath) {
    const issuesMessage = issues.map(issue => issue.body  + " " + issue.user.login).join('\n');
    fs.appendFileSync(filePath, issuesMessage, 'utf8');
}

function writePullRequestsToFile(pullRequests, filePath) {
    const pullRequestsMessage = pullRequests.map(pullRequest => pullRequest.body  + " " + pullRequest.user.login).join('\n');
    fs.appendFileSync(filePath, pullRequestsMessage, 'utf8');
}