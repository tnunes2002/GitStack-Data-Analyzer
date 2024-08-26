import constants from "../configs/constants.js";

export function getCurrentDate(){
    let currentDate = new Date();
    return currentDate.toISOString();
}

export function formatDate(dateToFormat){
    let date = new Date(dateToFormat);
    date.setSeconds(date.getSeconds() + 1);
    return date.toISOString();
}

export function collectionNameParser(searchURL){
    switch(searchURL){
        case constants.API_BASEURL_SEARCH_COMMITS:
            return constants.MONGODB_COMMITS_COLLECTION_NAME;

        case constants.API_BASEURL_SEARCH_PULLREQUESTS_ISSUES:
            return constants.MONGODB_ISSUES_PULLREQUESTS_COLLECTION_NAME;

        default:
            return ""
    }
}

export function isDateBefore(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return d1.getTime() < d2.getTime();
}

export function getDateFromRequest(url, request){
    switch(url){
        case constants.API_BASEURL_SEARCH_COMMITS:
            return request.commit.author.date;
        case constants.API_BASEURL_SEARCH_PULLREQUESTS_ISSUES:
            return request.created_at;
    }
}

export function getTextFromCollectionName(doc, collectionName){
    switch(collectionName){
        case constants.MONGODB_COMMITS_COLLECTION_NAME:
            return doc.commit.message;
        case constants.MONGODB_ISSUES_PULLREQUESTS_COLLECTION_NAME:
            return doc.title + " " + doc.body
    }
}
