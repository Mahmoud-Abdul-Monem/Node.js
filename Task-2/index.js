let num1 = 12
const fFunction = () => {
for (let i = 0 ; i < 13 ; i++) {
  if(num1 % i == 0 ) {
    console.log(i);

  }
}
}
fFunction()

let num2 = 210
let num3 = 70
const sFunction = () => {
  let min = (Math.min(num2 , num3))
  for (let i = min ; i >= 1; i--) {
  if(num2 % i == 0 && num3 % i == 0) {
    console.log(i);
    break;
  }
}
}
sFunction()

let n = 3
let count  = 1
const tFunction = () => {
  for (let i = 0 ; i < n; i++) {

    console.log(`${count}  ${count + 1} ${count + 2} pum`);
    count += 4

}
}
tFunction()

let x = 4;
let y = 9;
const foFunction = () => {
  let max = Math.max(y, x);
  let min = Math.min(y, x);
  let res = 0;
  for (let i = min + 1; i < max; i++) {
    if (i % 2 !== 0) {
      res += i;
    }
  }
    console.log(res);
};
foFunction();
