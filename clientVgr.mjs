import net from 'net';
import readline from 'readline';
import chalk from 'chalk';

export const alfabeto = 'abcdefghijklmnopqrstuvwxyz';

console.log(chalk.green('Iniciando o cliente...'));

const client = net.createConnection({ port: 3000 }, () => {
    console.log(chalk.green('Conectado ao servidor.'));
});

client.on('data', (data) => {
    let t1 = vigenereDecrypt(data,  "fogo")
    console.log(chalk.blue(`tentativa 1: ${t1}`));
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
    if (input === 'vigenere') {
        rl.question('Mensagem: ', (msg) => {
            rl.question('voltas: ', (key) => {
            });      
        });   
    } else {
        client.write(input);
    }
});



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