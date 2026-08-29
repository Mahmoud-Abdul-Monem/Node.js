import express from "express";

const app = express();

app.use(express.json());

const users = [
    { name: "eyad", age: 20 },
    { name: "ahmed", age: 18 },
];

app.post("/users", (req, res) => {
    const data = req.body; 
    users.push(data);
    res.status(201).json({ message: "User added successfully", user: data });
});

app.get("/users", (req, res) => {
    res.status(200).json(users);
});

app.get("/users/:name", (req, res) => {
    const userName = req.params.name; 
    const user = users.find((u) => u.name === userName);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ error: `user ${userName} not found` });
    }
});

app.patch()
app.put()
app.delete()

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
