import net from 'net';
import readline from 'readline';
import chalk from 'chalk';
import { alfabeto } from './crypto.js';

const voltas = 3

console.log(chalk.green('Iniciando o cliente...'));

const client = net.createConnection({ port: 3000 }, () => {
    console.log(chalk.green('Conectado ao servidor.'));
});

client.on('data', (data) => {
    const encryptedMessage = data.toString().trim();
    cesarDecrypt(encryptedMessage, voltas);
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
        let y = cesar(input, voltas);
        console.log(cesar);
        console.log(y);
        cesarDecrypt(y, voltas);
        client.write(y);
    });

function cesar(msg, chave) {
    let result = '';

    if (!(msg.length > 0)) {
        throw new Error('A mensagem não pode estar vazia.');
    }
    
    if (chave === 0 || isNaN(chave)) {
        throw new Error('A chave deve ser um número diferente de zero.');
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
}

export function cesarDecrypt(encryptedMessage, key, alphabet = alfabeto) {
    let decrypted = '';
    let keyValue = calculateKeyValue(key, alphabet);

    for (let i = 0; i < encryptedMessage.length; i++) {
        let char = encryptedMessage[i].toLowerCase();

        if (alphabet.includes(char)) {
            let newIndex = (alphabet.indexOf(char) - keyValue + alphabet.length) % alphabet.length;
            decrypted += alphabet[newIndex];
        } else {
            decrypted += encryptedMessage[i];
        }
    }
    console.log(decrypted)
    return decrypted;
}

// Função calculateKeyValue que gera o valor da chave
function calculateKeyValue(key, alphabet) {
    return key % alphabet.length;
}
