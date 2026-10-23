
import express from "express";
import { connectToMongoDB } from "./db/index.ts";

const app = express();
app.use(express.json());

app.get("/movies/gt8.5", async (req, res) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db("sample_mflix");

        const movies = await db.collection("movies").find({
            "imdb.rating": { $gt: 8.5 },
            "imdb.votes": { $gt: 100000 },
            "awards.wins": { $gte: 5 }
        }).project({
            title: 1,
            year: 1,
            "imdb.rating": 1,
            "awards.wins": 1,
            _id: 0
        }).toArray();

        res.json({ movies });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/theaters/san-francisco-los-angeles", async (req, res) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db("sample_mflix");

        const theaters = await db.collection("theaters").find({
            "location.address.state": "CA",
            "location.address.city": { $in: ["San Francisco", "Los Angeles"] }
        }).project({
            theaterId: 1,
            "location.address.street1": 1,
            "location.address.city": 1,
            _id: 0
        }).toArray();
        res.json({ theaters });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/movies/matrix-comments", async (req, res) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db("sample_mflix");

        const data = await db.collection("movies").aggregate([
            {
                $match: {
                    title: "The Matrix",
                    year: 1999
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "movie_id",
                    as: "movie_comments"
                }
            }
        ]).toArray();

        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.get("/movies/sci-fi-recent-comments", async (req, res) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db("sample_mflix");

        const data = await db.collection("movies").aggregate([
            {
                $match: {
                    genres: "Sci-Fi",
                    "imdb.rating": { $gt: 8.5 }
                }
            },
            {
                $lookup: {
                    from: "comments",
                    let: { movieId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$movie_id", "$$movieId"] } } },
                        { $sort: { date: -1 } },
                        { $limit: 3 },
                        {
                            $project: {
                                name: 1,
                                text: 1,
                                date: 1,
                                _id: 0
                            }
                        }
                    ],
                    as: "recent_comments"
                }
            }
        ]).toArray();

        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});

