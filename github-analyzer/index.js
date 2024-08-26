import { searchApiParamsPage } from "./configs/config.js";
import constants from "./configs/constants.js";
import { startSearchTool, startSearchToolByPage } from "./utils/dataManager.js"
import { getPaginatedData } from "./utils/paginationHandler.js";
import { formatDate, getCurrentDate } from "./utils/utils.js"


/*
 https://docs.github.com/en/rest/search?apiVersion=2022-11-28#search-commits
*/

startSearchTool(formatDate("2022-12-06T17:13:39.000+08:00"), ["ChatGPT"]);
//startSearchToolByPage(["chatGPT"], formatDate("2020-08-25T05:43:02.000Z"));