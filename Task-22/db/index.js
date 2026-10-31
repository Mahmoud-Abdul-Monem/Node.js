import dns from 'node:dns';
import mongoose from 'mongoose';

dns.setServers(['8.8.8.8', '1.1.1.1']);

export async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('You successfully connected to MongoDB!');

        return mongoose;
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        throw err;
    }
}

export async function disconnectFromMongoDB() {
    await mongoose.connection.close();
}