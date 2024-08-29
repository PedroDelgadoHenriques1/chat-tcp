import net from 'net';
import readline from 'readline';
import chalk from 'chalk';
import { playfairCipher } from './playfair.js';
import { alfabeto } from './crypto.js';
// import { vigenereDecrypt } from './decrypto.js';
// import { cesar, vigenere } from './crypto.js';
// const prompt = require('prompt-sync')({sigint: true});

console.log(chalk.green('Iniciando o cliente...'));

const client = net.createConnection({ port: 3000 }, () => {
    console.log(chalk.green('Conectado ao servidor.'));
});

client.on('data', (data) => {
    let t1 = vigenereDecrypt(data,  "fogo")
    console.log(chalk.blue(`tentativa 1: ${t1}`));
    let t2 = decryptMessage("informatica", data)
    console.log(chalk.blue(`tentativa 2: ${t2}`));
    let t3 = cesarDecrypt(data)
    console.log(chalk.blue(`tentativa 3: ${t3}`));
    // let t4 = cesar(data)
    // console.log(chalk.blue(`tentativa 4: ${t4}`));
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
    if (input === 'cesar') {
        rl.question('Mensagem: ', (answer) => {
            let x = cesar(answer, 23)
            console.log(`${x}!`);
            client.write(descriptografar(x));
        });        
       
    } else if (input === 'vigenere') {
        rl.question('Mensagem: ', (answer) => {
            let x = vigenere(answer, "fogo")
            console.log(`${x}`);
            x = x.toString()
            let y = vigenereDecrypt(x, "fogo")
            console.log(y)
            y = y.toString()
            client.write(x);
        });      
    } else if (input === 'mono') {
        rl.question('Mensagem: ', (answer) => {
            let x = monoAlfabeticas(answer, "zbcdefghijklmnopqrstuvwxya")
            console.log(`${x}`);
            client.write(x);
        });     

    } else if (input === 'playfair') {
        rl.question('Mensagem: ', (answer) => {
            let x = playfairCipher("informatica", answer)
            console.log(`${x}`);
            client.write(x);
        });    
    } else {
        client.write(input);
    }
});


function cesar(msg, chave) {
    let result = '';
  
    if (!(msg.length > 0)) {
        throw(e)
    }
    
    if (chave % chave != 0) {
        throw(e)
    }

    for (let i = 0; i < msg.length; i++) {
      const char = msg[i];
      const index = alfabeto.indexOf(char.toLowerCase());
  
      if (index !== -1) {
        const newIndex = (index + chave) % alfabeto.length;
        result += alfabeto[newIndex];
      } else {
        result += char;
      }
    }
  
    return result;
  };

export function vigenere(msg, chave) {
    chave = chave.repeat(Math.ceil(msg.length / chave.length))
    let cryptograma = []
 
    for (var i = 0; i < msg.length; i++) {
        let char = msg[i]

        if (char != " ") {
            let chaveChar = chave[i]
            let diferenca = alfabeto.indexOf(chaveChar);
            let crytoChar = alfabeto[(alfabeto.indexOf(char) + diferenca) % alfabeto.length];

            cryptograma.push(crytoChar)
        } else {
            cryptograma.push(" ")
        }

    }

    return cryptograma.join('')
}

function monoAlfabeticas(text, substitution) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';

    // Verifica se o alfabeto de substituição é válido
    if (!validateSubstitution(substitution)) {
        throw new Error('O alfabeto de substituição deve ter 26 letras únicas. Exemplo: zbcdefghijklmnopqrstuvwxya');
    }

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const index = alphabet.indexOf(char.toLowerCase());

        if (index !== -1) {
            // Adiciona o caractere substituído ao resultado
            result += substitution[index];
        } else {
            // Mantém caracteres não alfabéticos inalterados
            result += char;
        }
    }

    return result;
}

export function vigenereDecrypt(msg, chave) {
    const diferenca = chave.repeat(Math.ceil(msg.length / chave.length)); // repete chave dentro do espaço de caracteres da mensagem
    const plaintext = [];
  
    for (let i = 0; i < msg.length; i++) {
      const msgChar = msg[i];
      if (msgChar != " ") {
        const keywordChar = diferenca[i];
        const shift = alfabeto.indexOf(keywordChar);
    
        const decryptedChar = alfabeto[(alfabeto.indexOf(msgChar) - shift + 26) % 26];
        plaintext.push(decryptedChar);
      } else {
        plaintext.push(" ");
      }
    }

    return plaintext.join("")

}

export function cesarDecrypt(encryptedMessage, key, alphabet = defaultAlphabet) {
    let decrypted = '';
    let keyValue = KeyValue(key, alphabet);

    for (let i = 0; i < encryptedMessage.length; i++) {
        let char = encryptedMessage[i].toLowerCase();

        if (alphabet.includes(char)) {
            let newIndex = (alphabet.indexOf(char) - keyValue + alphabet.length) % alphabet.length;
            decrypted += alphabet[newIndex];
        } else {
            decrypted += encryptedMessage[i];
        }
    }

    return decrypted;
}

export function prepareKey(key) {
    key = key.toUpperCase().replace(/J/g, 'I');
    
    let seen = new Set();
    let uniqueKey = '';
    for (let char of key) {
        if (!seen.has(char) && char.match(/[A-Z]/)) {
            seen.add(char);
            uniqueKey += char;
        }
    }
    
    let alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    for (let char of uniqueKey) {
        alphabet = alphabet.replace(char, '');
    }
    
    let keySquare = uniqueKey + alphabet;

    let matrix = [];
    for (let i = 0; i < 25; i++) {
        matrix.push(keySquare[i]);
    }
    
    return matrix;
}

export function createMatrix(matrix) {
    let result = [];
    for (let i = 0; i < 5; i++) {
        result.push(matrix.slice(i * 5, i * 5 + 5));
    }
    return result;
}

export function prepareMessage(message) {
    message = message.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    
    // Adiciona 'X' se o comprimento da mensagem for ímpar
    if (message.length % 2 !== 0) {
        message += 'X';
    }
    
    return message;
}

export function findPosition(matrix, char) {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (matrix[i][j] === char) {
                return { row: i, col: j };
            }
        }
    }
    return null;
}

export function encryptMessage(matrix, message) {
    let encryptedMessage = '';
    for (let i = 0; i < message.length; i += 2) {
        let char1 = message[i];
        let char2 = message[i + 1];
        
        let pos1 = findPosition(matrix, char1);
        let pos2 = findPosition(matrix, char2);
        
        if (pos1.row === pos2.row) {
            encryptedMessage += matrix[pos1.row][(pos1.col + 1) % 5];
            encryptedMessage += matrix[pos2.row][(pos2.col + 1) % 5];
        } else if (pos1.col === pos2.col) {
            encryptedMessage += matrix[(pos1.row + 1) % 5][pos1.col];
            encryptedMessage += matrix[(pos2.row + 1) % 5][pos2.col];
        } else {
            encryptedMessage += matrix[pos1.row][pos2.col];
            encryptedMessage += matrix[pos2.row][pos1.col];
        }
    }
    return encryptedMessage;
}



export function decryptMessage(matrix, message) {
    let decryptedMessage = '';
    for (let i = 0; i < message.length; i += 2) {
        let char1 = message[i];
        let char2 = message[i + 1];
        
        let pos1 = findPosition(matrix, char1);
        let pos2 = findPosition(matrix, char2);
        
        if (pos1.row === pos2.row) {
            decryptedMessage += matrix[pos1.row][(pos1.col - 1 + 5) % 5]; // Move left
            decryptedMessage += matrix[pos2.row][(pos2.col - 1 + 5) % 5]; // Move left
        } else if (pos1.col === pos2.col) {
            decryptedMessage += matrix[(pos1.row - 1 + 5) % 5][pos1.col]; // Move up
            decryptedMessage += matrix[(pos2.row - 1 + 5) % 5][pos2.col]; // Move up
        } else {
            decryptedMessage += matrix[pos1.row][pos2.col];
            decryptedMessage += matrix[pos2.row][pos1.col];
        }
        
    }
    return decryptedMessage;
}

export function playfairDecrypt(key, message) {
    let keyMatrix = prepareKey(key);
    let matrix = createMatrix(keyMatrix);
    let preparedMessage = prepareMessage(message);
    return decryptMessage(matrix, preparedMessage);
}


let key = "Playfair";
let encryptedMessage = playfairCipher(key, "esconda o ouro sob o carvalho leste");
let decryptedMessage = playfairDecrypt(key, encryptedMessage);