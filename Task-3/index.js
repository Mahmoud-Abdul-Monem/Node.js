let a = 3
let b = 3
let s = [1,2,3,"-",4,5,6]

const funcOne = () => {
    if (s.length !== a + b + 1) {
        console.log("No");
        return null;
    }

    if (s[a] !== '-') {
        console.log("No");
        return null;
    }

    let isNum = true;

    for (let i = 0; i < s.length; i++) {
        if (i === a) continue;

        if (s[i] < '0' || s[i] > '9') {
            isNum = false;
            break;
        }
    }

    if (isNum == true) {
        console.log("Yes");
    } else {
        console.log("No");
    }
};

funcOne();


let arr = [1, 2, 0, 4, 0, 5, 6]

const funcTwo = () => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 0) {
            let reversedPart = arr.slice(0, i).reverse();
            let remainingPart = arr.slice(i);
            arr = [...reversedPart, ...remainingPart];
        }
    }
    console.log(arr)
}

funcTwo()



let newArr = [4, 4, 5];

const funcThree = () => {
    let count = 0;

    for (let i = 0; i < newArr.length; i++) {
        if (newArr.includes(newArr[i] + 1)) {
            count++;
        }
    }

    console.log(count);
};

funcThree();






let newArr2 = [1, 2, 3, 4, 5];
let result = [];

const funcFour = () => {

    while (newArr2.length > 0) {

        let removeF = newArr2.shift();
        result.push(removeF);


        if (newArr2.length > 0) {
            let removeL = newArr2.pop();
            result.push(removeL);
        }
    }

    console.log(result);
};

funcFour();


let replaceArr = [4, 1, 3, 10, 8]

const funcFive = () => {
    let minIndex = 0
    let maxIndex = 0
    for (let i = 1; i < replaceArr.length; i++) {
        if (replaceArr[i] < replaceArr[minIndex]) {
            minIndex = i;
        }
        if (replaceArr[i] > replaceArr[maxIndex]) {
            maxIndex = i
        }
    }
    let swap = replaceArr[minIndex]
    replaceArr[minIndex] = replaceArr[maxIndex]
    replaceArr[maxIndex] = swap;

    console.log(replaceArr)
};

funcFive();







let pairArray = [20, 1, 9, 4];

const functionSix = () => {
    let absoluteMin = Infinity;

    for (let i = 0; i < pairArray.length; i++) {
        for (let l = i + 1; l < pairArray.length; l++) {

            let currentCalculation = pairArray[i] + pairArray[l] + l - i;

            if (currentCalculation < absoluteMin) {
                absoluteMin = currentCalculation;
            }
        }
    }

    console.log(absoluteMin);
};

functionSix();



let lastArr = [1, 2, 3];

const functionSeven = () => {
    let lowest = lastArr[0];
    let position = 1;

    for (let i = 1; i < lastArr.length; i++) {
        if (lastArr[i] < lowest) {
            lowest = lastArr[i];
            position = i + 1;
        }
    }

    console.log(`${lowest} ${position}`);
};

functionSeven();


