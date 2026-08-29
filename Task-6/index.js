const checkPositive = (n) => {
    return new Promise((res, rej) => {
        if (n >= 0) {
            res(`${n} is positive`);
        } else {
            rej(`${n} is not positive`);
        }
    });
}
checkPositive(5)
    .then(result => console.log(result))
    .catch(error => console.log(error));

checkPositive(-3)
    .then(result => console.log(result))
    .catch(error => console.log(error));


const randomDelay = (min, max) => {
    return new Promise((res, rej) => {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        setTimeout(() => {
            res(`Waited ${delay}ms`);
        }, delay);
    });
};
randomDelay(10, 20).then(res => console.log(res))


    let testPass = "timonlinux50"

const validatePassword = () => {
    return new Promise((res, rej) => {
        if (/^.{8,}$/.test(testPass)) {
            res("Password accepted"); 
        } else {
            rej("Password is too short"); 
        }
    })
}
validatePassword().then(res=> console.log(res)).catch(rej => console.log(rej)) 



const getUser = async (id) => {
    try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

        if (!res.ok) {
            throw new Error("Network res was not ok");
        }

        const user = await res.json();

        console.log("User:", user.name);
        return user;

    } 

    catch (error) {
        console.log("Failed to get user:", error);
    }
};
getUser(1);



const getPostAndAuthor = async (postId) => {
    try {
        const postRes = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);

        if (!postRes.ok) {
            throw new Error("Failed to fetch post");
        }

        const post = await postRes.json();

        const userRes = await fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`);

        if (!userRes.ok) {
            throw new Error("Failed to fetch author");
        }

        const author = await userRes.json();

        console.log(`"${post.title}" by ${author.name}`);

        return { post, author };

    } catch (err) {
        console.log("Error:", err.message);
    }
};

getPostAndAuthor(1);