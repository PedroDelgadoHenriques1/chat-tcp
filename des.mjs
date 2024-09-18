import net from 'net';
import readline from 'readline';
import chalk from 'chalk';

// Texto plano: Cybersecurity melhor disciplina do curso.
let plaintext = "Cybersecurity melhor disciplina do curso."; 

// Chave fornecida: D&Ot)[YW
let key = "D&Ot)[YW";

// Converter texto e chave para ASCII
function stringToAsciiArray(str) {
    return str.split('').map(char => char.charCodeAt(0));
}

// Gerar o fluxo de chave repetindo os caracteres da chave
function generateKeyStream(keyAscii, length) {
    let keyStream = [];
    for (let i = 0; i < length; i++) {
        keyStream.push(keyAscii[i % keyAscii.length]);
    }
    return keyStream;
}

// Função básica que realiza a operação XOR entre os bytes do texto e da chave
function xorOperation(plaintextAscii, keyStream) {
    return plaintextAscii.map((char, index) => char ^ keyStream[index]);
}

// Converter texto ASCII de volta para string
function asciiArrayToString(asciiArray) {
    return asciiArray.map(charCode => String.fromCharCode(charCode)).join('');
}

// Converte array de números para uma string formatada
function arrayToString(arr) {
    return arr.map(num => num.toString(10)).join(' ');
}

// Texto e chave convertidos para ASCII
let plaintextAscii = stringToAsciiArray(plaintext);
let keyAscii = stringToAsciiArray(key);

// Gerar fluxo de chave
let keyStream = generateKeyStream(keyAscii, plaintextAscii.length);

// Criptografar texto
let ciphertextAscii = xorOperation(plaintextAscii, keyStream);

// Exibir resultados
console.log("Texto Plano ASCII: [" + arrayToString(plaintextAscii) + "]");
console.log("Chave ASCII: [" + arrayToString(keyAscii) + "]");
console.log("Fluxo de chave gerado: [" + arrayToString(keyStream) + "]");
console.log("Texto Criptografado: [" + arrayToString(ciphertextAscii) + "]");
console.log("Texto Criptografado (em string): " + asciiArrayToString(ciphertextAscii));

// Descriptografar (XOR novamente com o fluxo de chave)
let decryptedAscii = xorOperation(ciphertextAscii, keyStream);
console.log("Texto Descriptografado: [" + arrayToString(decryptedAscii) + "]");
console.log("Texto Descriptografado (em string): " + asciiArrayToString(decryptedAscii));
