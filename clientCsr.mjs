import net from 'net';
import readline from 'readline';
import chalk from 'chalk';
import { alfabeto } from './crypto.js'

console.log(chalk.green('Iniciando o cliente...'));

const client = net.createConnection({ port: 3000 }, () => {
    console.log(chalk.green('Conectado ao servidor.'));
});

client.on('data', (data) => {
    let csr = cesarDecrypt(data)
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
            rl.question('voltas: ', (key) => {
                let y = cesar(msg, key)
                console.log(y)
                y = y.toString()
                client.write(x);
            });      
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
