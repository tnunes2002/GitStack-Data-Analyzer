import { genericRequest } from "../services/githubService.js";

export async function getPaginatedData(url, params) {
    let results = [];
    let response;
    do {
      response = await genericRequest(url, params);
      results = results.concat(response.data);

      if (response.headers.link && response.headers.link.includes('rel="next"')) {
        const nextPage = response.headers.link.match(/<([^>]+)>;\s*rel="next"/)[1];
        params.page = new URL(nextPage).searchParams.get('page');
      } else {
        response = null;
      }
    } while (response);
    return results;
  }