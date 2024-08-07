import searchPublicRepos from "./services/githubService.js"


const repos = await searchPublicRepos(0);
console.log(repos);
console.log(repos.data.length);
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