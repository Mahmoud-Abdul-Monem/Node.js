import express from "express";
import { createDB } from "./db.js";
import { authorRouter } from "./routes/author.routes.js";
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
        return res.status(404).json({
            message: "user not found",
        });
    }
});




app.use("/authors", authorRouter)

app.get("/test-error", async (req, res) => {
    throw new Error("اختبار الـ Global Error Handler في Express 5");
});
app.use(async (err, req, res, next) => {
    console.error("Caught Error:", err.message);

    try {
        await db.create("errors", {
            message: err.message || "Internal Server Error",
            stack: err.stack,
            method: req.method,
            url: req.url,
            timestamp: new Date().toISOString()
        });
    } catch (saveError) {
        console.error("Failed to write error to db:", saveError);
    }

    return res.status(err.status || 500).json({
        message: "Something went wrong, please try again later"
    });
});

app.listen(3000, () => {
    console.log("listening on port 3000");
});
