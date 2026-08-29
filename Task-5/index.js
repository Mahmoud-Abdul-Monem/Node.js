uniqueStyles = [
    "Dub,Dancehall",
    "Industrial,Heavy Metal",
    "Techno,Dubstep",
    "Synth-pop,Euro-Disco",
    "Industrial,Techno,Minimal"
]


const uniqueStylesFun = () => {
    let allStyles = uniqueStyles.join(',').split(',');
    const final = new Set(allStyles).size
    console.log(final)
    return final;
}
uniqueStylesFun()


const reorderDigits = (arr, direction) => {
    return arr.map(num => {
        let digits = num.toString().split('');

        if (direction === 'asc') {
            digits.sort((a, b) => a - b);
        } else {
            digits.sort((a, b) => b - a);
        }

        return Number(digits.join(''));
    });
}
console.log(reorderDigits([515, 341, 98, 44, 211], "asc"));
console.log(reorderDigits([515, 341, 98, 44, 211], "desc"));

const isRepDigit = (num) => {
    if (num < 0) return false;

    return /^(\d)\1*$/.test(num);
};

console.log(isRepDigit(65));
console.log(isRepDigit(66));




let lonelyInteger = [1, -1, 2, -2, 3];

const lonelyIntFun = () => {
    return lonelyInteger.find(el => !lonelyInteger.includes(-el));
};

console.log(lonelyIntFun());


const polygoAngles = (num) => {
    num = (num - 2) * 180
    console.log(num)
}

polygoAngles(6)


const turnSomeLettersTo = (text) => {
    let result = text.replaceAll('a', '4').replaceAll('e', '3').replaceAll('i', '1').replaceAll('o', '0').replaceAll('s', '5');

    return result;
};

console.log(turnSomeLettersTo("hello world"));
