import express from "express";
import { createDB } from "./db.js";

const app = express();
const db = createDB();

app.use(express.json());

app.use((req, res, next) => {
    console.log(new Date().toLocaleString(), req.method, req.url);
    next();
});

// app.use((req, res, next) => {
//   if (req.method == "GET" && req.url == "/users") {
//     res.json("hello");
//   }
//   next();
// });

app.get("/users", async (req, res) => {
    // get all users from db
    const users = await db.getAll("users");

    // send as json
    res.json({
        data: users,
    });
});

// users/1
// users/2
// users/34567
// users/90
app.get("/users/:user_id", async (req, res) => {
    // get user by id from database
    const user = await db.getById("users", req.params.user_id);

    //send as json
    res.json({
        data: user,
    });
});

app.post("/users", async (req, res) => {
    // get data from req body
    const userData = req.body;

    // add to database
    await db.create("users", userData);

    // return response
    res.status(201).json({
        message: "user created successfully",
    });
});

app.patch("/users/:user_id", async (req, res) => {
    // get id from params
    const id = req.params.user_id;

    // check database
    const user = await db.getById("users", id);

    if (!user) {
        return res.status(404).json({
            message: "user not found",
        });
    }

    // get data from body
    const updateData = req.body;

    // update in database
    await db.update("users", id, updateData);

    const newUser = await db.getById("users", id);

    // return res
    return res.status(200).json({
        message: "user updated successfully",
        data: newUser,
    });
});

app.delete("/users/:user_id", async (req, res) => {
    // get id from params
    const id = req.params.user_id;

    // check if in database
    const user = await db.getById("users", id);

    // if present delete -> return res
    if (user) {
        await db.delete("users", id);
        return res.status(204).json({
            message: "user deleted successfully",
        });
    } else {
        // if not present -> 404
        return res.status(404).json({
            message: "user not found",
        });
    }
});



// author


app.get("/authors", async (req, res) => {
    const authors = await db.getAll("authors")
    res.json({
        data: authors
    })
})


app.get("/authors/:author_id", async (req, res) => {
    const authorId = req.params.author_id;
    const author = await db.getById("authors", authorId);

    if (!author) {
        return res.status(404).json({ message: "author not found" });
    }

    res.json({ data: author });
});

app.post("/authors", async (req, res) => {
    const authorData = req.body;
    const newAuthor = await db.create("authors", authorData);

    res.status(201).json({
        message: "author created successfully",
        data: newAuthor,
    });
});

app.patch("/authors/:author_id", async (req, res) => {
    const authorId = req.params.author_id;
    const author = await db.getById("authors", authorId);

    if (!author) {
        return res.status(404).json({ message: "author not found" });
    }

    const updateData = req.body;
    await db.update("authors", authorId, updateData);
    const updatedAuthor = await db.getById("authors", authorId);

    return res.status(200).json({
        message: "author updated successfully",
        data: updatedAuthor,
    });
});

app.delete("/authors/:author_id", async (req, res) => {
    const authorId = req.params.author_id;
    const author = await db.getById("authors", authorId);

    if (author) {
        await db.delete("authors", authorId);
        return res.status(200).json({
            message: "author deleted successfully",
        });
    } else {
        return res.status(404).json({ message: "author not found" });
    }
});

app.get("/authors", async (req, res) => {
    const searchParam = req.query.search
    if (searchParam) {
        const filteredAuthors = await db.searchByName("authors", searchParam)
        return res.json({
            data: filteredAuthors
        })
    }

})


app.listen(3000, () => {
    console.log("listening on port 3000");
});
