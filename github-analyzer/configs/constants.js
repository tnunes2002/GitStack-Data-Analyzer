const constants = {
    API_BASEURL_COMMITS : "GET /repos/{owner}/{repo}/commits",
    API_BASEURL_PUBLICREPOS: "GET /repositories",
    API_BASEURL_ISSUES: "GET /repos/{owner}/{repo}/issues",
    API_BASEURL_PULLREQUESTS: "GET /repos/{owner}/{repo}/pulls",
    API_BASEURL_SEARCH_COMMITS: "GET /search/commits",
    API_BASEURL_SEARCH_PULLREQUESTS_ISSUES: "GET /search/issues",
    API_BASEURL_SEARCH_REPO: "GET /repos/{owner}/{repo}",
    API_BASEURL_STARGAZERS: "GET /repos/{owner}/{repo}/stargazers",
    API_BASEURL_GETCOMMIT_BY_SHA: "GET /repos/{owner}/{repo}/commits/{ref}",
    API_BASEURL_GETISSUE: "GET /repos/{owner}/{repo}/issues/{commitNumber}",
    API_BASEURL_GETPULLREQUEST: "GET /repos/{owner}/{repo}/pulls/{pullNumber}",

    API_PERPAGE_ELEMENTS: 100,

    MONGODB_URL: "mongodb://0.0.0.0:27017/",
    MONGODB_DATABASE_NAME: "githubAnalyzer",
    MONGODB_REPOS_COLLECTION_NAME: "repos",
    MONGODB_COMMITS_COLLECTION_NAME: "commits_llama",
    MONGODB_ISSUES_PULLREQUESTS_COLLECTION_NAME: "issues_pullrequests_llama",

    NGRAM_FILEPATH: "ngrams_llama.txt",
    MONGODB_NGRAM_ELEMENTS: "ngram_llama",
    MONGODB_NGRAM_ELEMENTS_PARSED: "ngram_parsed_llama"
}

export default constants;