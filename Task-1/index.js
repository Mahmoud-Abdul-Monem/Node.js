// first assignment
let x = 5  
let y = 10

const fFunction = () => {
     console.log(`summation :${x + y}`),
    console.log(`multiplication :${x * y}`),
    console.log(`subtraction :${x - y}`) }

fFunction()
// second assignment 

let a = 10;
let b = 3;

const sFunction = () => {
    
       console.log(`floor: ${Math.floor(a / b)}`) 
       console.log(`round: ${Math.round(a / b)}`) 
       console.log(`ceil: ${Math.ceil(a / b)}`) 
    
}

sFunction()
 
// third assignment 


let pADiscount = 80
let discountPercent = 20
const pBDiscount = pADiscount / ((100 - discountPercent) / 100);
const tFunction = () => {
    
    console.log(`price before discount: ${pBDiscount}`) 
    console.log(`discount percentage: ${discountPercent}%`) 
       console.log(`price after discount: ${pADiscount}`) 
    
}

tFunction()
 