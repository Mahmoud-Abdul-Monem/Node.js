

import { MongoClient } from 'mongodb';
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const client = new MongoClient("mongodb+srv://linuxuser908_db_user:vE6jVqE98JWgTlFl@cluster0.kqnkdom.mongodb.net/");

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!");
        return client;
    } catch (err) {
        console.dir(err);
        throw err;
    }
}

export async function disconnectFromMongoDB() {
    await client.close();
}