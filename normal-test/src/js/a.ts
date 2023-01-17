// function flat(obj: any, depth: number): any {
//   if (!obj) return {};

//   if (typeof obj === 'object') {
//     if (depth <= 0) {
//       return JSON.stringify(obj, undefined, 3);
//     }
//     return Object.keys(obj).reduce((prev, key) => {
//       prev[key] = flat(obj[key], depth - 1);
//       return prev;
//     }, {});
//   }

//   if (Array.isArray(obj)) {
//     if (depth <= 0) {
//       return JSON.stringify(obj, undefined, 3);
//     }
//     return obj.map((sub) => flat(sub, depth - 1));
//   }

//   return obj;
// }

// const obj = {
//   level1: {
//     level2: {
//       level3: 'a',
//     }
//   }
// }

// console.log('obj: ', obj)
// console.log('flat: ', flat(obj, 2))

function test() {
  for (let i = 0; i < 10; i++) {
    if (i === 5) {
      // return;
      break;
    }
    console.log(i)
  }
  console.log('end')
}

test();