const constants = {
    API_BASEURL_COMMITS : "GET /repos/{owner}/{repo}/commits",
    API_BASEURL_PUBLICREPOS: "GET /repositories",
    API_BASEURL_ISSUES: "GET /repos/{owner}/{repo}/issues",
    API_BASEURL_PULLREQUESTS: "GET /repos/{owner}/{repo}/pulls",
    API_BASEURL_SEARCH_COMMITS: "GET /search/commits",
    API_BASEURL_SEARCH_PULLREQUESTS_ISSUES: "GET /search/issues",
    API_BASEURL_SEARCH_REPO: "GET /repos/{owner}/{repo}",
    API_BASEURL_STARGAZERS: "GET /repos/{owner}/{repo}/stargazers",

    API_PERPAGE_ELEMENTS: 100,

    MONGODB_URL: "mongodb://0.0.0.0:27017/",
    MONGODB_DATABASE_NAME: "githubAnalyzer",
    MONGODB_REPOS_COLLECTION_NAME: "repos",
    MONGODB_COMMITS_COLLECTION_NAME: "commits_copilot",
    MONGODB_ISSUES_PULLREQUESTS_COLLECTION_NAME: "issues_pullrequests_copilot",

    NGRAM_FILEPATH: "ngrams_copilot.txt",
    MONGODB_NGRAM_ELEMENTS: "ngram_copilot",
    MONGODB_NGRAM_ELEMENTS_PARSED: "ngram_parsed_copilot"
}

export default constants;