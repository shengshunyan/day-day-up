
const arr = [
    { num: 10 },
    { num: 2 },
    { num: 3 },
    { num: undefined },
    { num: 100 },
    { num: undefined },
    { num: 6 },
    { num: 9 },
]

arr.sort((a, b) => {
    if (Number.isNaN(a.num - b.num)) {
        return -1
    }
    return a.num - b.num;
})

console.log(arr)