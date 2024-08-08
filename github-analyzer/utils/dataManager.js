import { publicReposApiParams, searchApiParams } from "../configs/config.js";
import constants from "../configs/constants.js";
import { writeToCollection } from "../repositories/mongodbRepository.js";
import { getPublicReposPaginatedData, getSinglePageDataSearch } from "./paginationHandler.js";
import { formatDate, getCurrentDate } from "./utils.js";

export async function startRepoTool(since){
    let currentSince = since;
    let numCalls = 0;

    do{
        const response = await getPublicReposPaginatedData(constants.API_BASEURL_PUBLICREPOS, publicReposApiParams(currentSince));
        currentSince =  response.nextPage;

        //await writeToCollection(constants.MONGODB_REPOS_COLLECTION_NAME, response.result);

        numCalls++;
        console.log(numCalls + " " + currentSince);
    }while (currentSince !==- 1);
}

export async function startSearchTool(startDate, keywords){
    const currentDate = getCurrentDate();

    keywords.forEach(word => {
        searchKeyword(word, startDate, currentDate);
    });
}

async function searchKeyword(keyword, startDate, finishDate){
    let nextDate = startDate;
    let response;
    
    do{
        response = await getSinglePageDataSearch(constants.API_BASEURL_SEARCH_COMMITS, searchApiParams(keyword, nextDate, finishDate))

        if(response.nextPage !== -1){
            nextDate = formatDate(response.nextDate);

            writeToCollection(constants.MONGODB_COMMITS_COLLECTION_NAME, response.result.data.items)
            
            console.log(nextDate + " " + response.result.data.items.length);
        }
    } while (response.nextPage !== -1);
}