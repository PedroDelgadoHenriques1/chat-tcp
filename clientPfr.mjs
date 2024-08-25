import net from 'net';
import readline from 'readline';
import chalk from 'chalk';

console.log(chalk.green('Iniciando o cliente...'));

const key = "fogo"

const client = net.createConnection({ port: 3000 }, () => {
    console.log(chalk.green('Conectado ao servidor.'));
});

client.on('data', (data) => {
    const encryptedMessage = data.toString().trim();
    let plaintext = playfairDecrypt(key, encryptedMessage)
    console.log(chalk.blue(`Mensagem descriptografa: ${plaintext}`));
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
    rl.question('Mensagem: ', (msg) => {
        rl.question('chave: ', (key) => {
            let x = playfairCipher(key, msg)
            console.log(`${x}`);
            client.write(x);
        });      
    });   
});

function prepareKey(key) {
    key = key.toUpperCase().replace(/J/g, 'I');
    
    let seen = new Set();
    let uniqueKey = '';
    for (let char of key) {
        if (!seen.has(char) && char.match(/[a-z]/)) {
            seen.add(char);
            uniqueKey += char;
        }
    }
    
    let alphabet = 'abcdefghiklmnopqrstuvwxyz';
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

function createMatrix(matrix) {
    let result = [];
    for (let i = 0; i < 5; i++) {
        result.push(matrix.slice(i * 5, i * 5 + 5));
    }
    return result;
}

function prepareMessage(message) {
    message = String(message).replace(/j/g, 'i').replace(/[^a-z]/g, '');

    if (message.length % 2 !== 0) {
        message += 'x';
    }
    
    return message;
}

function findPosition(matrix, char) {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (matrix[i][j] === char) {
                return { row: i, col: j };
            }
        }
    }
    return null;
}

function encryptMessage(matrix, message) {
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

function playfairCipher(key, message) {
    let keyMatrix = prepareKey(key);
    let matrix = createMatrix(keyMatrix);
    let preparedMessage = prepareMessage(message);
    return encryptMessage(matrix, preparedMessage);
}

function decryptMessage(matrix, message) {
    let decryptedMessage = '';
    for (let i = 0; i < message.length; i += 2) {
        let char1 = message[i];
        let char2 = message[i + 1];
        
        let pos1 = findPosition(matrix, char1);
        let pos2 = findPosition(matrix, char2);
        
        if (!pos1 || !pos2) {
            console.error(`Character not found in matrix: ${char1} or ${char2}`);
            return null;
        }
        
        if (pos1.row === pos2.row) {
            decryptedMessage += matrix[pos1.row][(pos1.col - 1 + 5) % 5]; // Move left
            decryptedMessage += matrix[pos2.row][(pos2.col - 1 + 5) % 5]; // Move left
        } else if (pos1.col === pos2.col) {
            decryptedMessage += matrix[(pos1.row - 1 + 5) % 5][pos1.col]; // Move up
            decryptedMessage += matrix[(pos2.row - 1 + 5) % 5][pos2.col]; // Move up
        } else {
            if (pos1.col < pos2.col) {
                decryptedMessage += matrix[pos1.row][pos1.col];
                decryptedMessage += matrix[pos2.row][pos2.col - 1];
            } else {
                decryptedMessage += matrix[pos1.row][pos1.col - 1];
                decryptedMessage += matrix[pos2.row][pos2.col];
            }
        }
    }
    return decryptedMessage.toLowerCase(); // Convert to lower case
}

function playfairDecrypt(key, message) {
    let keyMatrix = prepareKey(key);
    let matrix = createMatrix(keyMatrix);
    let preparedMessage = prepareMessage(message);
    return decryptMessage(matrix, preparedMessage);
}


