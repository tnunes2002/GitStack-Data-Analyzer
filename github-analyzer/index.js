import { searchApiParamsPage } from "./configs/config.js";
import constants from "./configs/constants.js";
import { removeDups } from "./repositories/mongodbRepository.js";
import { startSearchTool, startSearchToolByPage } from "./utils/dataManager.js"
import { readNGramFile } from "./utils/fileManager.js";
import { generateNGramsFromCollection, joinDatabaseWithRepos, joinWordsWithDatabase } from "./utils/nGramManager.js";
import { getPaginatedData, getSinglePageData, getSinglePageDataSearch } from "./utils/paginationHandler.js";
import { formatDate, getCurrentDate } from "./utils/utils.js"


/*
 https://docs.github.com/en/rest/search?apiVersion=2022-11-28#search-commits
*/


//removeDups(constants.MONGODB_COMMITS_COLLECTION_NAME);
//startSearchTool(formatDate("2020-12-07T01:54:57.000Z"), ["Copilot"]);
//startSearchToolByPage(["chatGPT"], formatDate("2020-08-25T05:43:02.000Z"));

//generateNGramsFromCollection([2, 3], [constants.MONGODB_COMMITS_COLLECTION_NAME, constants.MONGODB_ISSUES_PULLREQUESTS_COLLECTION_NAME], "copilot");
//joinWordsWithDatabase(getNG)
const words = readNGramFile("tokens_copilot.txt");
const collectionNames = [constants.MONGODB_COMMITS_COLLECTION_NAME, constants.MONGODB_ISSUES_PULLREQUESTS_COLLECTION_NAME];
joinWordsWithDatabase(words, collectionNames)
//joinDatabaseWithRepos(constants.MONGODB_NGRAM_ELEMENTS);
//console.log(await getSinglePageData(constants.API_BASEURL_SEARCH_COMMITS, searchApiParamsPage("Copilot", 1)));