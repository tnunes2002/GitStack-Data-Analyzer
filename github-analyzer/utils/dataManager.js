import { publicReposApiParams } from "../configs/config.js";
import constants from "../configs/constants.js";
import { writeToCollection } from "../repositories/mongodbRepository.js";
import { getPublicReposPaginatedData } from "./paginationHandler.js";


export async function startSearchTool(since){
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