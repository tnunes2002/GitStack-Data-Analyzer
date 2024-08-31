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

export function readNGramFile(filePath){
    const nGrams = [];

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');

    lines.forEach(line => {
      if (line.trim() !== '') { 
        const [key, value] = line.split(':').map(item => item.trim()); 
        nGrams.push(key); 
      }
    });
  } catch (error) {
    console.error('Errore durante la lettura del file:', error);
  }

  return nGrams;
}