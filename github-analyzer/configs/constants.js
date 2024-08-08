const constants = {
    API_BASEURL_COMMITS : "GET /repos/{owner}/{repo}/commits",
    API_BASEURL_PUBLICREPOS: "GET /repositories",
    API_BASEURL_ISSUES: "GET /repos/{owner}/{repo}/issues",
    API_BASEURL_PULLREQUESTS: "GET /repos/{owner}/{repo}/pulls",
    API_BASEURL_SEARCH_COMMITS: "GET /search/commits",

    API_PERPAGE_ELEMENTS: 100,

    MONGODB_URL: "mongodb://0.0.0.0:27017/",
    MONGODB_DATABASE_NAME: "githubAnalyzer",
    MONGODB_REPOS_COLLECTION_NAME: "repos",
    MONGODB_COMMITS_COLLECTION_NAME: "commits"
}

export default constants;