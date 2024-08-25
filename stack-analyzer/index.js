import axios from 'axios'
import * as fs from 'fs';



// Funzione per il ritardo (sleep)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Funzione per cercare domande su Stack Overflow
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
        filter: 'withbody',
    };

    try {
        await sleep(100); // Aggiungi un ritardo di 100ms tra le richieste
        const response = await axios.get(url, { params });
        return response.data.items;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.error("Superato il limite di richieste, attendo prima di riprovare...");
            await sleep(10000); // Attendi 10 secondi prima di riprovare
            return await searchQuestions(query, fromDate, toDate, page, pageSize);
        } else {
            console.error("Errore nel recuperare le domande:", error);
            return [];
        }
    }
}

// Funzione per ottenere le risposte di una domanda
async function getAnswers(questionId) {
    const url = `https://api.stackexchange.com/2.3/questions/${questionId}/answers`;
    const params = {
        order: 'desc',
        sort: 'votes',
        site: 'stackoverflow',
        filter: 'withbody', // Include il corpo della risposta nei risultati
    };

    try {
        await sleep(100); // Aggiungi un ritardo di 100ms tra le richieste
        const response = await axios.get(url, { params });
        return response.data.items.map(answer => ({
            body: answer.body,
            score: answer.score,
            is_accepted: answer.is_accepted
        }));
    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.error(`Superato il limite di richieste per le risposte della domanda ${questionId}, attendo prima di riprovare...`);
            await sleep(10000); // Attendi 10 secondi prima di riprovare
            return await getAnswers(questionId);
        } else {
            console.error(`Errore nel recuperare le risposte per la domanda ${questionId}:`, error);
            return [];
        }
    }
}

// Funzione per scrivere le domande e risposte su un file JSON
async function writeQuestionsAndAnswersToJsonFile(questions, filePath) {
    let allData = [];

    for (const question of questions) {
        if (question.score > 0) {  // Filtra le domande con score positivo
            const answers = await getAnswers(question.question_id);
            allData.push({
                title: question.title,
                link: question.link,
                tags: question.tags,
                creation_date: new Date(question.creation_date * 1000).toISOString(),
                score: question.score,
                body: question.body,  // Includi il corpo della domanda
                answers: answers
            });
        }
    }

    // Scrivi i dati nel file JSON
    fs.writeFileSync(filePath, JSON.stringify(allData, null, 2), 'utf8');
}

// Funzione principale
async function main() {
    const queries = ['ChatGpt']; // Modifica questi con i tuoi argomenti di ricerca
    const filePath = 'questions_and_answers.json';
    const pageSize = 100;
    const maxPages = 100; // Numero massimo di pagine da recuperare per query

    // Intervallo di date (timestamp Unix)
    const fromDate = Math.floor(new Date('2023-01-01').getTime() / 1000); // Data di inizio
    const toDate = Math.floor(new Date('2023-03-31').getTime() / 1000); // Data di fine

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

            // Verifica se hai raggiunto il limite di 10.000 risultati
            if (allQuestions.length >= 10000) {
                console.log(`Raggiunto il limite di 10.000 risultati. Interruzione.`);
                break;
            }
        }
    }

    // Scrivi tutte le domande e le risposte filtrate nel file JSON
    await writeQuestionsAndAnswersToJsonFile(allQuestions, filePath);
    console.log(`Salvate un totale di ${allQuestions.length} domande e le rispettive risposte su ${filePath}`);
}

main();