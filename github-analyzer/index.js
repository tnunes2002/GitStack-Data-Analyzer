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

    const data = await octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner: owner,
        repo: repoName
    })
    
    writeCommitsToFile(data.data, "commits.txt");
    data.data.forEach(element => {
        console.log("message: " + element.commit.message);
        count++;
    });

    console.log(count);
});

// Funzione per scrivere i commit su un file
function writeCommitsToFile(commits, filePath) {
    const commitMessages = commits.map(commit => commit.commit.message  + " " + commit.commit.author).join('\n');
    fs.appendFileSync(filePath, commitMessages, 'utf8');
}
