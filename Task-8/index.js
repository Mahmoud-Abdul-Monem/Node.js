import express from "express"

const app = express()

app.use(express.json())

const users = [
    { name: "eyad", age: 20 },
    { name: "ahmed", age: 18 },
]

app.post("/users", (req, res) => {
    const data = req.body
    users.push(data)
    res.status(201).json({ message: "User added successfully", user: data })
})

app.get("/users", (req, res) => {
    res.status(200).json(users)
})

app.get("/users/:name", (req, res) => {
    const userName = req.params.name
    const user = users.find((el) => el.name === userName)

    if (user) {
        res.status(200).json(user)
    } else {
        res.status(404).json({ error: `user ${userName} not found` })
    }
})

app.patch("/users/:name", (req, res) => {
    const userName = req.params.name
    const { name, age } = req.body || {}
    const userIndex = users.findIndex(el => el.name === userName)

    if (userIndex === -1) {
        return res.status(404).json({ error: `User ${userName} not found` })
    }
    if (name !== undefined) users[userIndex].name = name;
    if (age !== undefined) users[userIndex].age = age;

    res.status(200).json({
        message: "User updated successfully",
        user: users[userIndex]
    })
})
app.put("/users/:name", (req, res) => {
    const userName = req.params.name;
    const { name, age } = req.body || {};

    const userIndex = users.findIndex(el => el.name === userName);

    if (userIndex === -1) {
        return res.status(404).json({ error: `User ${userName} not found` });
    }
    if (!name || age === undefined) {
        return res.status(400).json({ error: "PUT requires both 'name' and 'age' fields" });
    }

    users[userIndex] = { name, age };

    res.status(200).json({
        message: "User replaced successfully",
        user: users[userIndex]
    });
});
app.delete("/users/:name", (req, res) => {
    const userName = req.params.name;
    const userIndex = users.findIndex(el => el.name === userName);

    if (userIndex === -1) {
        return res.status(404).json({ error: `User ${userName} not found` });
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    return res.status(200).json({
        message: "User deleted successfully",
        deletedUser: deletedUser
    });
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
})
