function prepareKey(key) {
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

function createMatrix(matrix) {
    let result = [];
    for (let i = 0; i < 5; i++) {
        result.push(matrix.slice(i * 5, i * 5 + 5));
    }
    return result;
}

function prepareMessage(message) {
    message = message.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    
    // Adiciona 'X' se o comprimento da mensagem for ímpar
    if (message.length % 2 !== 0) {
        message += 'X';
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

function playfairDecrypt(key, message) {
    let keyMatrix = prepareKey(key);
    let matrix = createMatrix(keyMatrix);
    let preparedMessage = prepareMessage(message);
    return decryptMessage(matrix, preparedMessage);
}


let key = "Playfair Example";
let encryptedMessage = playfairCipher(key, "esconda o ouro sob o carvalho leste");
let decryptedMessage = playfairDecrypt(key, encryptedMessage);

console.log('crypto:', encryptedMessage);
console.log('decrypto:', decryptedMessage);
