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
    let csr = cesarDecrypt(encryptedMessage, voltas);
    console.log(chalk.blue(`Mensagem: ${csr}`));
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
        rl.question('Mensagem: ', (msg) => {
            rl.question('Voltas: ', (key) => {
                const chave = parseInt(key);
                if (isNaN(chave)) {
                    console.error(chalk.red('A chave deve ser um número.'));
                    return;
                }
                let y = cesar(msg, chave);
                console.log(y);
                client.write(y);
            });
        });
    } else {
        client.write(input);
    }
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

    return decrypted;
}

// Função calculateKeyValue que gera o valor da chave
function calculateKeyValue(key, alphabet) {
    return key % alphabet.length;
}
