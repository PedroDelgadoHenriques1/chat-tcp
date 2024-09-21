function hexToBinary(hex) {
    return hex.split('')
        .map(char => parseInt(char, 16).toString(2).padStart(4, '0'))
        .join('');
}

// Mensagem e chave
const messageHex = '4174616361722062';
const keyHex = '0123456789ABCDEF';

// Conversões
const messageBinary = hexToBinary(messageHex);
const keyBinary = hexToBinary(keyHex);

console.log('Mensagem Binária:', messageBinary);
console.log('Chave Binária:', keyBinary);
