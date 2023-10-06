const {odd, even} = require('./01-02-var');
const mtest = require('./01-02-var');
function checkOddOrEven(num) {
    if (num%2) {
        return odd;
    }
    return even;
}

console.log(checkOddOrEven(5));

function checkOddOrEven2(num) {
    if (num%2) {
        return mtest.odd;
    }
    return mtest.even;
}

console.log(checkOddOrEven2(8))