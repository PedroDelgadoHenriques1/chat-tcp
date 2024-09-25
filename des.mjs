//                                                          -----> Passo 0: Criando chaves <----- ! //
console.log('Step 0: Initialization');
const message = '0123456789ABCDEF';
const key = '0123456789ABCDEF';


//                                                          -----> Passo 1: conversão para binário <----- ! //
console.log('\n\nStep 1: Convert to binary');
function hexToBin(hex) {
    return hex.split('').map(char => {
        return parseInt(char, 16).toString(2).padStart(4, '0');
    }).join('');
}

const messageBinary = hexToBin(message);
const keyBinary = hexToBin(key);
console.log("Mensagem em binário:", messageBinary);
console.log("Chave em binário:", keyBinary);


//                                                          -----> Passo 2: Permutando para 56 bits para Paridade/segurança
console.log('\n\nStep 2: Permute the key through the PC-1 table');
const PC1 = [
    57, 49, 41, 33, 25, 17, 9,
    1, 58, 50, 42, 34, 26, 18,
    10, 2, 59, 51, 43, 35, 27,
    19, 11, 3, 60, 52, 44, 36,
    63, 55, 47, 39, 31, 23, 15,
    7, 62, 54, 46, 38, 30, 22,
    14, 6, 61, 53, 45, 37, 29,
    21, 13, 5, 28, 20, 12, 4
];

function permuteKey(keyBinary, table) {
    return table.map(position => keyBinary[position - 1]).join('');
}

const permutedKey = permuteKey(keyBinary, PC1);
console.log("Chave após permutação PC-1:", permutedKey);


//                                                          -----> Passo 3: Rotating each half
console.log('\n\nStep 3: Rotating each half');
const rotations = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

function leftRotate(bits, numrotations) {
    return bits.slice(numrotations) + bits.slice(0, numrotations);
}

function splitKey(permutedKey) {
    const C0 = permutedKey.slice(0, 28);
    const D0 = permutedKey.slice(28);
    return { C0, D0 };
}

function rotateHalves(C0, D0, rotations) {
    let C = C0;
    let D = D0;

    const roundKeys = [];

    rotations.forEach(rotation => {
        C = leftRotate(C, rotation);
        D = leftRotate(D, rotation);

        roundKeys.push({ C, D });
    });

    return roundKeys;
}

const { C0, D0 } = splitKey(permutedKey);
const rotatedKeys = rotateHalves(C0, D0, rotations);

rotatedKeys.forEach((key, index) => {
    console.log(`Rodada ${index + 1} - C: ${key.C}, D: ${key.D}`);
});


//                                                          -----> Passo 4: Concatenation
console.log('\n\nStep 4: Concatenation');
function concatenateHalves(C, D) {
    return C + D;
}

const concatenatedKeys = rotatedKeys.map((key, index) => {
    const concatenatedKey = concatenateHalves(key.C, key.D);
    console.log(`Rodada ${index + 1} - Chave concatenada: ${concatenatedKey}`);
    return concatenatedKey;
});


//                                                          -----> Passo 5: Permute the key through the PC-2 table
console.log('\n\nStep 5: Permute the key through the PC-2 table');
const PC2 = [
    14, 17, 11, 24, 1, 5,
    3, 28, 15, 6, 21, 10,
    23, 19, 12, 4, 26, 8,
    16, 7, 27, 20, 13, 2,
    41, 52, 31, 37, 47, 55,
    30, 40, 51, 45, 33, 48,
    44, 49, 39, 56, 34, 53,
    46, 42, 50, 36, 29, 32
];

function permutePC2(concatenatedKey) {
    return PC2.map(position => concatenatedKey[position - 1]).join('');
}

const subKeys = concatenatedKeys.map((key, index) => {
    const subKey = permutePC2(key);
    console.log(`Rodada ${index + 1} - Subchave de 48 bits: ${subKey}`);
    return subKey;
});


//                                                          -----> Passo 6: Permute the message through IP
console.log('\n\nStep 6: Permute the message through IP');
const IP = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
];

function permuteMessage(messageBinary) {
    return IP.map(position => messageBinary[position - 1]).join('');
}

const permutedMessage = permuteMessage(messageBinary);
console.log("Mensagem após permutação IP:", permutedMessage);


//                                                          -----> Passo 7: Encode the data 
console.log('\n\nStep 7: Encode the data ');
const E = [
    32, 1, 2, 3, 4, 5,
    4, 5, 6, 7, 8, 9,
    8, 9, 10, 11, 12, 13,
    12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21,
    20, 21, 22, 23, 24, 25, 24, 25,
    26, 27, 28, 29, 28, 29, 30, 31, 32, 1
];

const SBoxes = [
    [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
    ],
    [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
    ],
    [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
    ],
    [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
    ],
    [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
    ],
    [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
    ],
    [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
    ],
    [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
    ]
];

const P = [
    16, 7, 20, 21,
    29, 12, 28, 17,
    1, 15, 23, 26,
    5, 18, 31, 10,
    2, 8, 24, 14,
    32, 27, 3, 9,
    19, 13, 30, 6,
    22, 11, 4, 25
];

function xorBinary(bin1, bin2) {
    let result = '';
    for (let i = 0; i < bin1.length; i++) {
        result += bin1[i] === bin2[i] ? '0' : '1';
    }
    return result;
}

let L = permutedMessage.slice(0, 32);
let R = permutedMessage.slice(32);

function f(RnMinus1, Kn) {
    const expandedRnMinus1 = E.map(position => RnMinus1[position - 1]).join('');
    const xorResult = xorBinary(expandedRnMinus1, Kn);
    const groups = [];

    for (let i = 0; i < 8; i++) {
        groups.push(xorResult.slice(i * 6, (i + 1) * 6));
    }

    let sBoxResult = '';
    groups.forEach((group, index) => {
        const row = parseInt(group[0] + group[5], 2);
        const col = parseInt(group.slice(1, 5), 2);
        const sBoxValue = SBoxes[index][row][col];
        sBoxResult += sBoxValue.toString(2).padStart(4, '0');
    });

    return P.map(position => sBoxResult[position - 1]).join('');
}



//                                                          -----> Passo 8 to Step 23: Computing ROUND 1 to 16
console.log('\n\nStep 8 to Step 23: Computing ROUND 1 to 16');
for (let round = 0; round < 16; round++) {
    const Kn = subKeys[round];
    const newR = xorBinary(L, f(R, Kn));

    L = R;
    R = newR;

    console.log(`Rodada ${round + 1} - L: ${L}, R: ${R}`);
}


//                                                          -----> Passo 24: Permute the encoded data through the IP-1 table
console.log('\n\nStep 24: Permute the encoded data through the IP-1 table');
const IP_1 = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25
];

function applyFinalPermutation(concatenatedLR) {
    let permutedData = '';
    IP_1.forEach(position => {
        permutedData += concatenatedLR[position - 1];
    });
    return permutedData;
}

const L16 = `${L}`
const R16 = `${R}`;
const R16L16 = R16 + L16;
const finalPermutation = applyFinalPermutation(R16L16);

console.log("Mensagem criptografada final:", finalPermutation);


//                                                          -----> Passo 25: Convert back into hexadecimal
console.log('\n\nStep 25: Convert back into hexadecimal');
function binaryToHex(binary) {
    let hex = '';
    for (let i = 0; i < binary.length; i += 4) {
        let nibble = binary.substr(i, 4);
        hex += parseInt(nibble, 2).toString(16).toUpperCase();
    }
    return hex;
}

const finalHex = binaryToHex(finalPermutation);

console.log("Mensagem criptografada final (hexadecimal):", finalHex);