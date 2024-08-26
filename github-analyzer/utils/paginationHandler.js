import { genericRequest } from "../services/githubService.js";
import { getDateFromRequest } from "./utils.js";

export async function getPaginatedData(url, params) {
    let results = [];
    let response;
    let pages = 0;

    do {
      response = await genericRequest(url, params);
      console.log(response)
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
      pages: pages + 1,
      result: results
    };
  }

export async function getSinglePageData(url, params){
  let response;
  let nextPage = -1;

  response = await genericRequest(url, params);

  if (response.headers.link && response.headers.link.includes('rel="next"')) {
    nextPage = response.headers.link.match(/<([^>]+)>;\s*rel="next"/)[1];
    nextPage = new URL(nextPage).searchParams.get('page');
  } 
  return {
    nextPage: nextPage,
    result: response.data.items
  };
}


/* Cambia dalla funzione getSinglePageData rispetto alla metodologia per
tirare giù la prossima pagina. */
export async function getSinglePageDataSearch(url, params){
  let response;
  let nextDate = -1;

  response = await genericRequest(url, params);
  if (response.headers.link && response.headers.link.includes('rel="next"')) {
    nextDate = getDateFromRequest(url, response.data.items.at(-1))
  }

  return {
    nextDate: nextDate,
    result: response
  };
}