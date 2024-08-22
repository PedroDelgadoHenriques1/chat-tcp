function prepareKey(key) {
    // Passo 1: Substituir I por J
    key = key.toUpperCase().replace(/J/g, 'I');
    
    // Passo 2: Remover letras repetidas
    let seen = new Set();
    let uniqueKey = '';
    for (let char of key) {
        if (!seen.has(char) && char.match(/[A-Z]/)) {
            seen.add(char);
            uniqueKey += char;
        }
    }
    
    // Passo 3: Remove letras do alfabeto
    let alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    for (let char of uniqueKey) {
        alphabet = alphabet.replace(char, '');
    }
    
    // Passo 4: Concatena chave e alfabeto
    let keySquare = uniqueKey + alphabet;

    // Passo 5: Monta a matriz 5x5
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
    
    // Passo 9: Adiciona 'X' se o comprimento da mensagem for ímpar
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
            // Letras na mesma linha
            encryptedMessage += matrix[pos1.row][(pos1.col + 1) % 5];
            encryptedMessage += matrix[pos2.row][(pos2.col + 1) % 5];
        } else if (pos1.col === pos2.col) {
            // Letras na mesma coluna
            encryptedMessage += matrix[(pos1.row + 1) % 5][pos1.col];
            encryptedMessage += matrix[(pos2.row + 1) % 5][pos2.col];
        } else {
            // Letras em diferentes linhas e colunas
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

// Exemplo de uso
let key = "Playfair Example";
let message = "Hide the gold in the tree stump";

console.log(playfairCipher(key, message)); // Resulta na mensagem cifrada
