import axios from 'axios'
import * as fs from 'fs';

// Funzione per cercare domande su Stack Overflow
async function searchQuestions(query, page = 1, pageSize = 10) {
    const url = `https://api.stackexchange.com/2.3/search/advanced`;
    const params = {
        order: 'desc',
        sort: 'activity',
        q: query,
        site: 'stackoverflow',
        pagesize: pageSize,
        page: page,
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
    const questionDetails = questions.map(question =>
        `Title: ${question.title}\nLink: ${question.link}\nTags: ${question.tags.join(', ')}\n`
    ).join('\n');
    fs.appendFileSync(filePath, questionDetails, 'utf8');
}

// Funzione principale
async function main() {
    const query = 'help of chatgpt'; // Modifica questo con la tua query di ricerca
    const filePath = 'questions.txt';
    const pageSize = 10;
    const maxPages = 5; // Numero massimo di pagine da recuperare

    // Cancella il contenuto del file prima di iniziare
    fs.writeFileSync(filePath, '');

    for (let page = 1; page <= maxPages; page++) {
        const questions = await searchQuestions(query, page, pageSize);

        if (questions.length > 0) {
            writeQuestionsToFile(questions, filePath);
            console.log(`Salvate ${questions.length} domande dalla pagina ${page} su ${filePath}`);
        } else {
            console.log(`Nessuna domanda trovata alla pagina ${page}. Interruzione.`);
            break;
        }
    }
}

main();
