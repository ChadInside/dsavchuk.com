const arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

function changeArg(argument) {
  argument.forEach((item) => item.id *= 2);
  return argument;
}
console.log(arr);
const arr2 = changeArg(arr);
console.log(arr2);
const arr3 = changeArg(arr);
console.log(arr3);

console.log('arr: ', arr);
console.log(arr2);
