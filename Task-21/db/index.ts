import { MongoClient } from 'mongodb';
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
process.loadEnvFile()
const client = new MongoClient(process.env.MONGO_SECRET!);

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