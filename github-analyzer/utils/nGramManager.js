import natural from "natural"
import { getCollection, writeToCollection } from "../repositories/mongodbRepository.js";
import { extractOwnerAndRepo, getTextFromCollectionName } from "./utils.js";
import { writeNgramToFile } from "./fileManager.js";
import constants from "../configs/constants.js";
import { genericRequest } from "../services/githubService.js";
import { searchRepoApiParams } from "../configs/config.js";

export async function generateNGramsFromCollection(frequencies, collectionNames, targetWord) {
    const nGramFrequency = {};
    let count = 0;
    targetWord = targetWord.toLowerCase();

    for await(const n of frequencies){
        for await (const collectionName of collectionNames){
            const cursor = await getCollection(collectionName);
            for await (const doc of cursor){
                let text = getTextFromCollectionName(doc, collectionName)
                const tokenizer = new natural.WordTokenizer();
                const tokens = tokenizer.tokenize(text.toLowerCase());
    
                count++;
                console.log(count + " " + collectionName)
                tokens.forEach((word, index) => {
                    if (word === targetWord) {
                      const start = Math.max(0, index - Math.floor(n / 2));
                      const end = Math.min(tokens.length, index + Math.ceil(n / 2));
                      const nGram = tokens.slice(start, end).join(' ');
                        
                      nGramFrequency[nGram] = (nGramFrequency[nGram] || 0) + 1;
                    }
                });
            }
        };
    }

    const nGramToWrite = {};

    Object.keys(nGramFrequency).forEach(words => {
        if(nGramFrequency[words] > 1000){
            console.log(words + ": " + nGramFrequency[words]);
            nGramToWrite[words] = nGramFrequency[words];
        }
    })

    writeNgramToFile(nGramToWrite, constants.NGRAM_FILEPATH)
}

export async function joinWordsWithDatabase(words, collectionNames){
    for await (const collectionName of collectionNames){
        const cursor = await getCollection(collectionName);
        for await (const doc of cursor){
            let text = getTextFromCollectionName(doc, collectionName).toLowerCase();
            if(words.some(keyword => text.includes(keyword))){
                writeToCollection(constants.MONGODB_NGRAM_ELEMENTS, [doc])
            }
        }
    };
}

export async function joinDatabaseWithRepos(collectionName){
    const cursor = await getCollection(collectionName);
    let cont = 0;
    let trashold =14500;
    for await (const doc of cursor){
        if(cont<trashold){
            cont++;
            continue;
        }
        console.log(cont);
        cont++;
        let repoName = null;
        let owner = null;
        let numStars = null;
        if(doc.repository){
            repoName = doc.repository.name
            owner = doc.repository.owner.login;
        }else{
            const url = doc.repository_url;
            const result = extractOwnerAndRepo(url);
            repoName = result.repo;
            owner = result.owner;
        }
        try{
            const reponse = await genericRequest(constants.API_BASEURL_STARGAZERS, searchRepoApiParams(owner, repoName));
            numStars = reponse.data.length;
        }catch (error) {
            console.log("error during fetching");
        }
    
        if(numStars>10){
            console.log("----------------------------------")
            console.log("scritto");
            //console.log(doc.repository.html_url);
            doc.numStars = numStars;
            writeToCollection(constants.MONGODB_NGRAM_ELEMENTS_PARSED, [doc]);
        }

    }
    console.log("finito");
}