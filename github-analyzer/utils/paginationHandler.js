import { genericRequest } from "../services/githubService.js";

export async function getPaginatedData(url, params) {
    let results = [];
    let response;
    let pages = 0;

    do {
      response = await genericRequest(url, params);
      results = results.concat(response.data);

      if (response.headers.link && response.headers.link.includes('rel="next"')) {
        const nextPage = response.headers.link.match(/<([^>]+)>;\s*rel="next"/)[1];
        params.page = new URL(nextPage).searchParams.get('page');
        pages++;
      } else {
        response = null;
      }
    } while (response);
    return {
      pages: pages,
      result: results
    };
  }

export async function getPublicReposPaginatedData(url, params){
  let response;
  let nextPage = -1;

  response = await genericRequest(url, params);

  if (response.headers.link && response.headers.link.includes('rel="next"')) {
    nextPage = response.headers.link.match(/since=(\d+)/)[1];
  } 

  return {
    nextPage: nextPage,
    result: response
  };
}