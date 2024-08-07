import { searchPublicRepos, getRepoCommits, genericRequest } from "./services/githubService.js"
import { commitsApiParams } from "./configs/config.js"
import constants from "./configs/constants.js"
import { getPaginatedData } from "./utils/paginationHandler.js"


/*const repos = await searchPublicRepos(0);
repos.data.forEach(repo => {
    if(repo.id===322){
        console.log(repo.owner)
    }
})
console.log(repos.data.length);*/

const commits = await getPaginatedData(constants.API_BASEURL_COMMITS, commitsApiParams("sevenwire", "forgery"))
console.log(commits)
console.log(commits.length)
/*
    primo:
    link: '<https://api.github.com/repositories/322/commits?per_page=100&page=2>; rel="next", <https://api.github.com/repositories/322/commits?per_page=100&page=3>; rel="last"',
    'referrer-policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',

    ultimo:
    link: '<https://api.github.com/repositories/322/commits?per_page=100&page=1>; rel="first", <https://api.github.com/repositories/322/commits?per_page=100&page=2>; rel="prev"',
    'referrer-policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',

*/


/*
var count = 0;
repos.data.forEach(async repo => {
    const owner = repo.owner.login;
    const repoName = repo.name;
    const word = "ChatGPT";

    console.log(owner + " " + repoName)

    const commits = await octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner: owner,
        repo: repoName,
        word: word
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

*/