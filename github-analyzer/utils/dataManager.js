import { publicReposApiParams, searchApiParams, searchApiParamsIssues, searchApiParamsPage, searchCommitBySha, searchIssueByRepo, searchPullRequestByRepo } from "../configs/config.js";
import constants from "../configs/constants.js";
import { writeToCollection } from "../repositories/mongodbRepository.js";
import { genericRequest, getCommitBySha } from "../services/githubService.js";
import { getSinglePageData, getSinglePageDataSearch } from "./paginationHandler.js";
import { collectionNameParser, formatDate, getCurrentDate, isDateBefore } from "./utils.js";
import fs from 'fs';
import path from 'path';

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

export async function parseLinesFromFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    
    const lines = data.split('\n');
    const outputLines = [];


    lines.forEach(line => {
        console.log(line);
        if (line.trim()) {
            const parts = line.split(',');
            const type = parts[1];
            //const description = parts[2].split(' -> ')[0];

            // Estrae l'ultimo pezzo dell'URL, che è l'hash del commit
            const commitHash = parts[2].split('/').pop();


            const owner = parts[2].split('/')[3];
            const repoName = parts[2].split('/')[4];

            // Crea la stringa finale nel formato desiderato
            const result = `${type}, DISCARDED, ${repoName} ${owner} ${commitHash}\n`;
            console.log(result);
            outputLines.push(result);
        }
    });

    fs.writeFileSync("parsed_" + filePath, outputLines.join('\n'), 'utf-8');
}


export async function parseElementsFromFile(filePath){
    const data = fs.readFileSync(filePath, 'utf-8');
    
    const lines = data.split('\n');
    const outputLines = [];
    //const response = await genericRequest(constants.API_BASEURL_GETCOMMIT_BY_SHA, searchCommitBySha("kmskrishna", "gdn", "4bf58561f39cf547d3e754826300bc5189343650"));
    //const response = await getCommitBySha("kmskrishna", "gdn", "4bf58561f39cf547d3e754826300bc5189343650");
    for(let line of lines) {
        if (line.trim()) {
            const parts = line.split(',');
            const type = parts[0];
            const description = parts[1];
            const owner = parts[2].split(' ')[2];
            const repoName = parts[2].split(' ')[1];
            console.log(parts);
            if(type === 'COMMIT'){
                let commitHash = parts[2].split(' ')[3];
                commitHash = commitHash.replace(/\r$/, "");
                const response = await await genericRequest(constants.API_BASEURL_GETCOMMIT_BY_SHA, searchCommitBySha(owner, repoName, commitHash));
                try{
                    const result = `${type}, ${description}, ${response.data.commit.message.replace(/[\n\r]+/g, " ")}\n`;
                    console.log(result)
                    outputLines.push(result);
                    fs.appendFileSync("new_parsed_" + filePath, result);
                }catch(error){
                    console.log(error)
                }
            }
            else if(type === 'ISSUE'){
                let commiitNumber = parts[2].split(' ')[3];
                commiitNumber = commiitNumber.replace(/\r$/, "");
                const response = await await genericRequest(constants.API_BASEURL_GETISSUE, searchIssueByRepo(owner, repoName, commiitNumber));
                console.log(response);
                try{
                    const result = `${type}, ${description}, ${response.data.title.replace(/[\n\r]+/g, " ")} ${response.data.body.replace(/[\n\r]+/g, " ")}\n`;
                    console.log(result)
                    outputLines.push(result);
                    fs.appendFileSync("new_parsed_" + filePath, result);
                }catch(error){
                    console.log(error)
                }
            } else if(type === 'PULL-REQUEST') {
                let pullRequestNumber = parts[2].split(' ')[3];
                pullRequestNumber = pullRequestNumber.replace(/\r$/, "");
                const response = await await genericRequest(constants.API_BASEURL_GETPULLREQUEST, searchPullRequestByRepo(owner, repoName, pullRequestNumber));
                try{
                    const result = `${type}, ${description}, ${response.data.title.replace(/[\n\r]+/g, " ")} ${response.data.body.replace(/[\n\r]+/g, " ")}\n`;
                    console.log(result)
                    outputLines.push(result);
                    fs.appendFileSync("new_parsed_" + filePath, result);
                }catch(error){
                    console.log(error)
                }
            }

            //const result = await genericRequest(publicReposApiParams)
        }
    };

    //fs.writeFileSync("new_parsed_" + filePath, outputLines.join('\n'), 'utf-8');
}