var express = require("express");
const app = express();
const PORT = 3030;

const { MongoClient, ServerApiVersion } = require("mongodb");
const client = new MongoClient("mongodb://0.0.0.0:27017/")
const db = client.db("githubAnalyzer");

app.get('/', async (req,res) => {
    const collection = db.collection("ngram_parsed");
    let randomDoc = await collection.aggregate([
        { $match: { category: { $exists: false } } },  // Filtra documenti senza il campo 'category'
        { $sample: { size: 1 } }  // Estrae 1 documento casuale
      ]).toArray();

    let response;
    randomDoc = randomDoc[0];
    if(randomDoc.commit){
        response = {
            id: randomDoc._id,
            type: 1,
            html_url: randomDoc.html_url,
            author: randomDoc.commit.author.name,
            email: randomDoc.commit.author.email,
            message: randomDoc.commit.message,
            date: randomDoc.commit.author.date
        }
    }else{
        response = {
            id: randomDoc._id,
            type: randomDoc.pull_request?2:3,
            html_url: randomDoc.html_url,
            author: randomDoc.user.login,
            title: randomDoc.title,
            body: randomDoc.body
        }
    }
    res.send(response);
})

app.listen(PORT, () => {
    console.log('App listening on port ' +  PORT);
})