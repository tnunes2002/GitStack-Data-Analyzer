import * as fs from 'fs';

export function writeCommitsToFile(commits, filePath) {
    const commitMessages = commits.map(commit => commit.commit.message  + " " + commit.commit.author).join('\n');
    fs.appendFileSync(filePath, commitMessages, 'utf8');
}

export function writeIssuesToFile(issues, filePath) {
    const issuesMessage = issues.map(issue => issue.body  + " " + issue.user.login).join('\n');
    fs.appendFileSync(filePath, issuesMessage, 'utf8');
}

export function writePullRequestsToFile(pullRequests, filePath) {
    const pullRequestsMessage = pullRequests.map(pullRequest => pullRequest.body  + " " + pullRequest.user.login).join('\n');
    fs.appendFileSync(filePath, pullRequestsMessage, 'utf8');
}

export function writeNgramToFile(nGram, filePath) {
    const fileStream = fs.createWriteStream(filePath, { flags: 'w' });

    Object.entries(nGram).forEach(([key, value]) => {
    fileStream.write(`${key}: ${value}\n`);
    });

    fileStream.end();
}