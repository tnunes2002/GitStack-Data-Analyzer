import { searchPublicRepos, getRepoCommits, genericRequest } from "./services/githubService.js"
import { commitsApiParams, publicReposApiParams } from "./configs/config.js"
import constants from "./configs/constants.js"
import { getPaginatedData, getPublicReposPaginatedData } from "./utils/paginationHandler.js"


/*const repos = await searchPublicRepos(0);
repos.data.forEach(repo => {
    if(repo.id===322){
        console.log(repo.owner)
    }
})
console.log(repos.data.length);*/

const commits = await getPaginatedData(constants.API_BASEURL_COMMITS, commitsApiParams("tnunes2002", "GitStack-Data-Analyzer"));

commits.result.forEach(commit => {
    console.log(commit.commit);
    console.log(commit.author);
    console.log(commit.committer)
})

/*const repos = await getPublicReposPaginatedData(constants.API_BASEURL_PUBLICREPOS, publicReposApiParams(3869359));
console.log(repos);*/
//const repos = await getPaginatedData(constants.API_BASEURL_PUBLICREPOS, publicReposApiParams(0));
/*
    primo:
    link: '<https://api.github.com/repositories/322/commits?per_page=100&page=2>; rel="next", <https://api.github.com/repositories/322/commits?per_page=100&page=3>; rel="last"',
    'referrer-policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',

    ultimo:
    link: '<https://api.github.com/repositories/322/commits?per_page=100&page=1>; rel="first", <https://api.github.com/repositories/322/commits?per_page=100&page=2>; rel="prev"',
    'referrer-policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',

*/