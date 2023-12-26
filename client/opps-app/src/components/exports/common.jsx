export var isEmpty = require('lodash/isEmpty');

export function getObjectKey(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}

// it takes an array of objects and a key and returns the correspionding value or null if not found
export function getTypeByKey(obj, key) {
    for (const pair of obj) {
        if (Object.values(pair).includes(key)) {
            return pair.type;
        }
    }
    return null; // Return null if the key is not found
}

// export function getObjectValueByKey(pairs, keyToFind) {
//     for (let i = 0; i < pairs.length; i++) {
//         if (pairs[i].key === keyToFind) {
//             return pairs[i].value;
//         }
//     }
//     return null; // Return null if the key is not found
// }