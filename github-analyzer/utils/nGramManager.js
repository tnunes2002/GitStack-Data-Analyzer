import natural from "natural"
import { getCollection } from "../repositories/mongodbRepository.js";
import { getTextFromCollectionName } from "./utils.js";
import { writeNgramToFile } from "./fileManager.js";
import constants from "../configs/constants.js";

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
        if(nGramFrequency[words] > 500){
            console.log(words + ": " + nGramFrequency[words]);
            nGramToWrite[words] = nGramFrequency[words];
        }
    })

    writeNgramToFile(nGramToWrite, constants.NGRAM_FILEPATH)
}