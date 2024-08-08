import { searchPublicRepos, getRepoCommits, genericRequest, searchCommitsWithKeyword } from "./services/githubService.js"
import { commitsApiParams, publicReposApiParams } from "./configs/config.js"
import constants from "./configs/constants.js"
import { getPaginatedData, getPublicReposPaginatedData } from "./utils/paginationHandler.js"
import { startSearchTool } from "./utils/dataManager.js"
import { getCurrentDate } from "./utils/utils.js"


/*
 https://docs.github.com/en/rest/search?apiVersion=2022-11-28#search-commits
*/

startSearchTool("2021-01-01", ["ChatGPT"]);
