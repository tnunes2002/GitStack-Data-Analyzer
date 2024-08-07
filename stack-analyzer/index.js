import axios from 'axios'
import * as fs from 'fs';


async function searchQuestions(query, fromDate, toDate, page = 1, pageSize = 100) {
    const url = `https://api.stackexchange.com/2.3/search/advanced`;
    const params = {
        order: 'desc',
        sort: 'activity',
        q: query,
        site: 'stackoverflow',
        pagesize: pageSize,
        page: page,
        fromdate: fromDate,
        todate: toDate,
    };

    try {
        const response = await axios.get(url, { params });
        return response.data.items;
    } catch (error) {
        console.error("Errore nel recuperare le domande:", error);
        return [];
    }
}

// Funzione per scrivere le domande su un file
function writeQuestionsToFile(questions, filePath) {
    // Filtra le domande con score positivo e ordina per data
    const filteredQuestions = questions.filter(question => question.score > 0);
    filteredQuestions.sort((a, b) => new Date(b.creation_date * 1000) - new Date(a.creation_date * 1000));

    const questionDetails = filteredQuestions.map(question =>
        `Title: ${question.title}\nLink: ${question.link}\nTags: ${question.tags.join(', ')}\nDate: ${new Date(question.creation_date * 1000).toISOString()}\nScore: ${question.score}\n`
    ).join('\n');

    fs.appendFileSync(filePath, questionDetails + '\n', 'utf8');
}

// Funzione principale
async function main() {
    const queries = ['Help of ChatGpt', 'ChatGPT to implement']; // Argomenti di ricerca
    const filePath = 'questions.txt';
    const pageSize = 100;
    const maxPages = 100; 

    
    const fromDate = Math.floor(new Date('2023-01-01').getTime() / 1000); // Data di inizio
    const toDate = Math.floor(new Date('2023-12-31').getTime() / 1000); // Data di fine

    
    fs.writeFileSync(filePath, '');

    let allQuestions = [];

    for (const query of queries) {
        console.log(`Eseguendo la ricerca per: ${query}`);
        for (let page = 1; page <= maxPages; page++) {
            const questions = await searchQuestions(query, fromDate, toDate, page, pageSize);

            if (questions.length > 0) {
                allQuestions = allQuestions.concat(questions);
                console.log(`Salvate ${questions.length} domande dalla pagina ${page} per la query "${query}"`);
            } else {
                console.log(`Nessuna domanda trovata alla pagina ${page} per la query "${query}". Interruzione.`);
                break;
            }

            // Controllo limite massimo
            if (allQuestions.length >= 10000) {
                console.log(`Raggiunto il limite di 10.000 risultati. Interruzione.`);
                break;
            }
        }
    }

    // Scrivi tutte le domande filtrate e ordinate su file
    writeQuestionsToFile(allQuestions, filePath);
    console.log(`Salvate un totale di ${allQuestions.length} domande su ${filePath}`);
}

main();