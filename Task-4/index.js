let dimensions = { width: 2, length: 5, height: 1 };
const volumeFun = () => {
    let volume = 1;

    for (const key in dimensions) {
        volume *= dimensions[key];


    }
    console.log(`the volume of the box is => ${volume}`);
    return volume;
}
volumeFun()


let cityFacts = {
    name: "Paris",
    population: "2,140,526",
    continent: "Europe"
}

const cityFun = () => {
    console.log(`${cityFacts.name} has a population of ${cityFacts.population} and is situated in ${cityFacts.continent}`);
}
cityFun()


let freeShipping = { "Shampoo": 5.99, "Rubber Ducks": 15.99 }
const freeShippFun = () => {
    let total = 0
    for (const key in freeShipping) {
        const element = freeShipping[key];

        total += element

    }

    if (total >= 50) {
        console.log("you have a free shipping")
    }
    else {
        console.log("sorry buddy you donot have a free shipping")
    }

}
freeShippFun()




let getBudgets = [
    { name: "John", age: 21, budget: 23000 },
    { name: "Steve", age: 32, budget: 40000 },
    { name: "Martin", age: 16, budget: 2700 }
]


const getBudgetsFun = () => {
    let totalBudget = 0
    getBudgets.map(el => {
        totalBudget += el.budget
    });
    console.log(totalBudget)
    return totalBudget
}
getBudgetsFun()



let getStudentsWithNamesAndTopNotes = [
    { "name": "John", "notes": [3, 5, 4] },
    { "name": "Max", "notes": [1, 4, 6] },
    { "name": "Zygmund", "notes": [1, 2, 3] }
]


const getStudentsNames = () => {
    getStudentsWithNamesAndTopNotes.forEach(el => {
        let maxNote = Math.max(...el.notes);
        console.log(`student name is : ${el.name} student highest note is: ${maxNote}`);
    });
}
getStudentsNames()


let determineWinnerOfFight = {
    round1: {
        me: 40,
        spouse: 5,
    },
    round2: {
        me: 9,
        spouse: 10,
    },
    round3: {
        me: 9,
        spouse: 10,
    },
}

const determineWinnerFun = () => {
    let myWins = 0
    let spouseWins = 0
    for (const key in determineWinnerOfFight) {
        const el = determineWinnerOfFight[key]
        if (el.me > el.spouse) {

            console.log(`my score is: ${el.me} spouse score is: ${el.spouse} and winner of the round is me`)
            myWins++
        }

        else if (el.me < el.spouse) {

            console.log(`my score is: ${el.me} spouse score is: ${el.spouse} and winner of the round is the spouse`)
        spouseWins++
        }
        else {
            console.log(`my score is: ${el.me} spouse score is: ${el.spouse} and it is a draw`)

        }

    }
    if (spouseWins > myWins) {
        console.log(`The overall winner is: the spouse with ${spouseWins} rounds`)
    }
    else if (myWins < spouseWins) {
        console.log(`The overall winner is: me with ${myWins} rounds`)
    }
    else {
        console.log("it is a draw")
    }

}
determineWinnerFun()



let toArray = { a: 1, b: 2 } 

const toArrayFun = () => {
    let array = Object.entries(toArray)
    console.log(array)
}
toArrayFun()