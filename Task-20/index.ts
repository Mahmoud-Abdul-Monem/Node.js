import express from "express";
import type { Request, Response } from "express"; 
import { connectToMongoDB } from "./db/index.ts";

const app = express();
app.use(express.json());

app.get("/movies/action-2015", async (req: Request, res: Response) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db("sample_mflix");
        const data = await db.collection("movies").find({
            year: 2015,
            genres: "Action",
            runtime: { $gt: 120 }
        }).toArray();
        res.json({ data });
    } catch (err: unknown) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.get("/movies/nolan", async (req: Request, res: Response) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db("sample_mflix");
        const data = await db.collection("movies").find({
            directors: "Christopher Nolan"
        }).project({
            title: 1,
            year: 1,
            runtime: 1,
            _id: 0
        }).sort({
            year: -1
        }).toArray();
        res.json({ data });
    } catch (err: unknown) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.post("/movies", async (req: Request, res: Response) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db("sample_mflix");
        const result = await db.collection("movies").insertOne({
            title: "Inception 2",
            year: 2026,
            runtime: 148,
            rated: "PG-13",
            type: "movie",
            genres: ["Action", "Sci-Fi"],
            num_mflix_comments: 10
        });
        res.json({ message: "Movie inserted successfully", result });
    } catch (err: unknown) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.put("/movies/update-popular", async (req: Request, res: Response) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db("sample_mflix");
        const result = await db.collection("movies").updateMany(
            {
                year: 2014,
                num_mflix_comments: { $gt: 5 }
            },
            {
                $set: { isPopular: true },
                $inc: { num_mflix_comments: 1 }
            }
        );
        res.json({ message: "Movies updated successfully", result });
    } catch (err: unknown) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.delete("/movies/old-short", async (req: Request, res: Response) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db("sample_mflix");
        const result = await db.collection("movies").deleteMany({
            year: { $lt: 1920 },
            runtime: { $lt: 30 }
        });
        res.json({ message: "Movies deleted successfully", result });
    } catch (err: unknown) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.get("/movies/stats", async (req: Request, res: Response) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db("sample_mflix");
        const data = await db.collection("movies").aggregate([
            {
                $match: { year: { $gte: 2010 } }
            },
            {
                $group: {
                    _id: "$year",
                    totalMovies: { $sum: 1 },
                    averageRuntime: { $avg: "$runtime" }
                }
            },
            {
                $sort: { _id: -1 }
            }
        ]).toArray();
        res.json({ data });
    } catch (err: unknown) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});