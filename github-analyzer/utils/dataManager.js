import { publicReposApiParams, searchApiParams, searchApiParamsIssues, searchApiParamsPage } from "../configs/config.js";
import constants from "../configs/constants.js";
import { writeToCollection } from "../repositories/mongodbRepository.js";
import { getSinglePageData, getSinglePageDataSearch } from "./paginationHandler.js";
import { collectionNameParser, formatDate, getCurrentDate, isDateBefore } from "./utils.js";

export async function startRepoTool(since){
    let currentSince = since;
    let numCalls = 0;

    do{
        const response = await getSinglePageData(constants.API_BASEURL_PUBLICREPOS, publicReposApiParams(currentSince));
        currentSince =  response.nextPage;

        //await writeToCollection(constants.MONGODB_REPOS_COLLECTION_NAME, response.result);

        numCalls++;
        console.log(numCalls + " " + currentSince);
    }while (currentSince !==- 1);
}

export async function startSearchTool(startDate, keywords){
    const currentDate = getCurrentDate();

    keywords.forEach(async word => {
        await searchKeyword(word, startDate, currentDate, constants.API_BASEURL_SEARCH_COMMITS);
        await searchKeyword(word, startDate, currentDate, constants.API_BASEURL_SEARCH_PULLREQUESTS_ISSUES);
    });
}

export async function startSearchToolByPage(keywords, finishDate){
    keywords.forEach(async word => {
        await searchKeywordByPage(word, finishDate, 1, constants.API_BASEURL_SEARCH_COMMITS);
        //await searchKeyword(word, startDate, currentDate, constants.API_BASEURL_SEARCH_PULLREQUESTS_ISSUES);
    });
}

async function searchKeywordByPage(keyword, finishDate, page, searchType){
    let currentPage = page;
    let currentLastDate = null;

    do{
        const response = await getSinglePageData(searchType, searchApiParamsPage(keyword, currentPage));
        currentPage = response.nextPage;

        if(response.result.length > 0){
            //contrllo se la data della chiamata corrente è minore della data di finishDate
            currentLastDate = response.result.at(-1).commit.author.date;

            writeToCollection(collectionNameParser(searchType), response.result)
        }

        console.log("CurrentPage: " + currentPage + " elements: " + response.result.length);
    } while(currentPage !== -1 && isDateBefore(finishDate, currentLastDate));

    console.log("Finished keyword " + keyword + " for " + searchType) 
}

async function searchKeyword(keyword, startDate, finishDate, searchType){
    let nextDate = startDate;
    let response;
    let lastItemId = null;
    
    do{
        if(searchType === constants.API_BASEURL_SEARCH_COMMITS){
            response = await getSinglePageDataSearch(searchType, searchApiParams(keyword, nextDate, finishDate));
        }else{
            response = await getSinglePageDataSearch(searchType, searchApiParamsIssues(keyword, nextDate));
        }
        
        //console.log(response);
        /*response.result.data.items.forEach(item => {
            console.log(item);
            console.log("----------------------------------------")
        })
        console.log("last item: ----------------------------------------")*/
        if(response.nextDate !== -1){
            nextDate = formatDate(response.nextDate);
        }

        /*To remove duplicates since sometimes the first element of the search and the last one of the previous search might be the same*/
        if (lastItemId &&  response.result.data.items.length > 0 &&  response.result.data.items[0].sha === lastItemId) {
            response.result.data.items.shift();
        }

        if(response.result.data.items.length > 0) {
            lastItemId = response.result.data.items.at(-1).sha;

            writeToCollection(collectionNameParser(searchType), response.result.data.items)
        }

        console.log("--------------------------------------------")
        console.log(response.result.url);
        console.log(nextDate + " " + response.result.data.items.length);
    } while (response.nextDate !== -1);

    console.log("Finished keyword " + keyword + " for " + searchType) 
}