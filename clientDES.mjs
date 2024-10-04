import net from 'net';
import readline from 'readline';
import chalk from 'chalk';

    // debug
        function stringTo64BitHex(input) {
            // Convert string to binary
            let binaryString = '';
            for (let i = 0; i < input.length; i++) {
                // Get the character code in binary and pad to 8 bits
                binaryString += input.charCodeAt(i).toString(2).padStart(8, '0');
            }

            // Ensure the binary string is exactly 64 bits
            if (binaryString.length < 64) {
                // Pad with zeros on the left
                binaryString = binaryString.padStart(64, '0');
            } else if (binaryString.length > 64) {
                // Truncate to 64 bits
                binaryString = binaryString.slice(0, 64);
            }

            // Convert binary to hexadecimal
            return binaryToHex(binaryString);
        }
    //debug


console.log(chalk.green('Iniciando o cliente...'));

const client = net.createConnection({ port: 3000 }, () => {
    console.log(chalk.green('Conectado ao servidor.'));
});

client.on('data', (data) => {
    const chave = '0123456789ABCDEF';
    let msgFinal = decryptHexListDES(data.toString(), chave);
    console.log('Mensagem: ', msgFinal);
});

client.on('end', () => {
    console.log(chalk.red('Desconectado do servidor.'));
});

client.on('error', (err) => {
    console.error(chalk.red(`Erro: ${err.message}`));
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    const chave = '0123456789ABCDEF';
    let item = criptografiaCompleto(input, chave);
    console.log('item', item)
    client.write(item);
});


function criptografiaCompleto(input, chave) {
    // Passo 1: conversão para binário
    console.log('\n\nPasso 1: Convert to binary');

    const mensagembinaria = textToBin(input);
    const chavebinaria = textToBin(chave);
    console.log("Mensagem em binário:", mensagembinaria);
    console.log("Chave em binário:", chavebinaria);


    // separar em 64bits

    function listBinary(mensagembinaria) {
          let listChunks = [];
          function* chunks(lst, n) {  
            for (let i = 0; i < lst.length; i += n) {
              yield lst.slice(i, i + n);
            }
          }

          let list = mensagembinaria.split(' ');
          for (const chunk of chunks(list, 8)) {
            listChunks.push(chunk);
          }

          let ultimaPosicao = listChunks[listChunks.length - 1];
          let diferenca = 8 - ultimaPosicao.length
          for (let i = 0; i < diferenca; i++) {
            ultimaPosicao.push('00000000');
          }

          return listChunks;
    }

    const list = listBinary(mensagembinaria);

    let msgCrypto = []

    const result = list.map(element => {
        element = element.join('');
        let element_hex = binaryToHex(element);
        const final = des(element_hex, chave);
        
        return final;
    });

    msgCrypto.push(...result);

    // console.log('msgCrypto', msgCrypto);

    return msgCrypto.join(' ');
}

function decryptHexListDES(hexCryptoList, chave) {
    let msgDescrypto = [];
    const result = hexCryptoList.split(' ').map(element => {
        const r = desDecrypt(hexCryptoList, chave);
        return r;
    });
    msgDescrypto.push(...result);
    let msgBin = msgDescrypto[0].join(' ');

    console.log('Mensagem em Binário', msgBin);

    return binaryToText(msgBin);

}

function binaryToText(binaryString) {
    const outputStr = binaryString.replace(/\s/g, '') 
    let text = ''

    for (let i = 0; i < outputStr.length; i += 8) {
        const byte = outputStr.slice(i, i + 8); // Pega 8 bits
        text += String.fromCharCode(parseInt(byte, 2)); // Converte para caractere
    }

    return text;
}


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

function leftRotate(bits, numrotacoes) {
            return bits.slice(numrotacoes) + bits.slice(0, numrotacoes);
        }

function splitKey(permutadaChave) {
            const C0 = permutadaChave.slice(0, 28);
            const D0 = permutadaChave.slice(28);
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

function concatenateHalves(C, D) {
            return C + D;
        }

function permutePC2(concatenatedKey) {
            return PC2.map(position => concatenatedKey[position - 1]).join('');
        }

function permuteMessage(mensagembinaria) {
    return IP.map(position => mensagembinaria[position - 1]).join('');
}

function applyFinalPermutation(concatenatedLR) {
            let permutedData = '';
            IP_1.forEach(position => {
                permutedData += concatenatedLR[position - 1];
            });
            return permutedData;
        }

function binaryToHex(binary) {
            let hex = '';
            for (let i = 0; i < binary.length; i += 4) {
                let nibble = binary.substr(i, 4);
                hex += parseInt(nibble, 2).toString(16).toUpperCase();
            }
            return hex;
        }

function permute(message, table) {
            return table.map(position => message[position - 1]).join('');
        }

function leftShift(key, shifts) {
            return key.slice(shifts).concat(key.slice(0, shifts));
        }

function xorBinary(bin1, bin2) {
    let result = '';
    for (let i = 0; i < bin1.length; i++) {
        result += bin1[i] === bin2[i] ? '0' : '1';
    }
    return result;
}


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

function splitIntoBlocks(hexStr, blockSize = 56) {
            let blocks = [];
            for (let i = 0; i < hexStr.length; i += blockSize * 2) {blocks.push(hexStr.slice(i, i + blockSize * 2));}
            return blocks;
}

function permuteKey(chavebinaria, table) {
            return table.map(position => chavebinaria[position - 1]).join('');
}

function hexParaBin(hex) {
    return hex.toString().split('').map(char => {
        return parseInt(char, 16).toString(2).padStart(4, '0');
    }).join('');
}

console.log('\n\nPasso 1: Convert to binary');


function textToBin(text) {
  var length = text.length,
      output = [];
  for (var i = 0;i < length; i++) {
    var bin = text[i].charCodeAt().toString(2);
    output.push(Array(8-bin.length+1).join("0") + bin);
  } 
  return output.join(" ");
}

function des(input, chave) {
    console.log('input: ', input, '\nchave: ', chave, '\n')
    const chavebinaria = hexParaBin(chave);

    console.log('\n\nPermutando para 56 bits para Paridade/segurança');
    const permutadaChave = permuteKey(chavebinaria, PC1);
    console.log("Chave após permutação PC-1:", permutadaChave);

    // Passo 3: Rotacionando cada metade
    console.log('\n\nPasso 3: Rotating each half');
    const rotations = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

    const { C0, D0 } = splitKey(permutadaChave);
    const rotatedKeys = rotateHalves(C0, D0, rotations);

    rotatedKeys.forEach((chave, index) => {
        console.log(`Rodada ${index + 1} - C: ${chave.C}, D: ${chave.D}`);
    });

    // Passo 4: Concatenação
    console.log('\n\nPasso 4: Concatenação');

    const concatenatedKeys = rotatedKeys.map((chave, index) => {
        const concatenatedKey = concatenateHalves(chave.C, chave.D);
        console.log(`Rodada ${index + 1} - Chave concatenada: ${concatenatedKey}`);
        return concatenatedKey;
    });


    // Passo 5: Permutando a chave através da tabela PC-2
    console.log('\n\nPasso 5:  Permutando a chave através da tabela PC-2');

    const subKeys = concatenatedKeys.map((chave, index) => {
        const subKey = permutePC2(chave);
        console.log(`Rodada ${index + 1} - Subchave de 48 bits: ${subKey}`);
        return subKey;
    });

    // Passo 6: Permute the mensagem through IP
    console.log('\n\nPasso 6: Permute the mensagem through IP');

    let binMsg = hexParaBin(input);
    console.log('binMsg', binMsg);
    const permutedMessage = permuteMessage(binMsg);
    console.log("Mensagem após permutação IP:", permutedMessage);


    // Passo 7: envolve a codificação de dados
    console.log('\n\nPasso 7: envolve a codificação de dados ');
    let L = permutedMessage.slice(0, 32);
    let R = permutedMessage.slice(32);

    // Passo 8 até passo 23: Computando a rodada 1 até 16
    console.log('\n\nPasso 8 até passo 23: Computando a rodada 1 até 16');
    for (let round = 0; round < 16; round++) {
        const Kn = subKeys[round];
        const newR = xorBinary(L, f(R, Kn));

        L = R;
        R = newR;

        console.log(`Rodada ${round + 1} - L: ${L}, R: ${R}`);
    }


    // Passo 24: Permute the encoded data through the IP-1 table 
    console.log('\n\nPasso 24: Permute the encoded data through the IP-1 table');


    const L16 = `${L}`
    const R16 = `${R}`;
    const R16L16 = R16 + L16;
    const finalPermutation = applyFinalPermutation(R16L16);

    console.log("Mensagem criptografada final:", finalPermutation);

    // Passo 25: Converter novamente para hexadecimal
    console.log('\n\nPasso 25: Converter novamente para hexadecimal');
    
    const finalHex = binaryToHex(finalPermutation);

    return finalHex;

};

function stringToHexList(str) {
  let hexList = [];
  for (let i = 0; i < str.length; i += 16) {
    hexList.push(str.substring(i, i + 16));
  }
  return hexList;
}

function desDecrypt(hexList, chave) {
    console.log('hexList.length', hexList.length);
    console.log('hexList', hexList.split(' '));
    hexList = hexList.split(' ')

    let decriptList = [];

    for (let i = 0; i < hexList.length; i += 1) {
        const cipherText = hexParaBin(hexList[i]); // Convert hex to binary
        const chavebinaria = hexParaBin(chave); // Convert key to binary

        // Step 1: Permute the key for 56 bits using PC1
        const permutadaChave = permuteKey(chavebinaria, PC1);
        console.log("Chave após permutação PC-1:", permutadaChave);

        // Step 2: Generate round subkeys
        const rotations = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

        const { C0, D0 } = splitKey(permutadaChave);
        const rotatedKeys = rotateHalves(C0, D0, rotations);
        rotatedKeys.forEach((chave, index) => {
            console.log(`Rodada ${index + 1} - C: ${chave.C}, D: ${chave.D}`);
        });

        const concatenatedKeys = rotatedKeys.map((chave, index) => {
            const concatenatedKey = concatenateHalves(chave.C, chave.D);
            console.log(`Rodada ${index + 1} - Chave concatenada: ${concatenatedKey}`);
            return concatenatedKey;
        });

        const subKeys = concatenatedKeys.map((chave, index) => {
            const subKey = permutePC2(chave);
            console.log(`Rodada ${index + 1} - Subchave de 48 bits: ${subKey}`);
            return subKey;
        });

        // Reverse the subkeys for decryption
        const reversedSubKeys = subKeys.reverse();

        // Step 3: Initial permutation of ciphertext
        const permutedCipherText = permute(cipherText, IP);

        // Split permuted text into two halves (L and R)
        let L = permutedCipherText.slice(0, 32);
        let R = permutedCipherText.slice(32);

        // Step 4: 16 rounds of DES (index changed to `j` to avoid conflict)
        for (let j = 0; j < 16; j++) {
            const tempL = L; // Store L(n) temporarily
            L = R; // L(n+1) = R(n)
            R = xorBinary(tempL, f(R, reversedSubKeys[j])); // R(n+1) = L(n) XOR f(R(n), K(n))
        }

        // Concatenate final halves and apply final permutation
        const finalBlock = R + L; // Invert L and R
        const decryptedText = applyFinalPermutation(finalBlock);

        decriptList.push(decryptedText);
    }

    return decriptList;
};
