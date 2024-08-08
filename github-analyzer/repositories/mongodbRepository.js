import { MongoClient } from "mongodb";
import constants from "../configs/constants.js";

console.log("conecting to database...");

const client = new MongoClient(constants.MONGODB_URL)
await client.connect();

console.log("sucessfully connected to database")

const db = client.db(constants.MONGODB_DATABASE_NAME);

export async function writeToCollection(collectionName, data){
    
    const collection = db.collection(collectionName);
    try {
        const result = await collection.insertMany(data);
        return result;
    } catch (error) {
        console.error(error);
    }
}

export async function closeConnection(){
    await client.close();

    console.log("database connection closed...")
}
