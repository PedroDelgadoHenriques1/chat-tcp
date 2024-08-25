import net from 'net';
import readline from 'readline';
import chalk from 'chalk';

const alfabeto = 'abcdefghijklmnopqrstuvwxyz';
const chave = 'fogo';

console.log(chalk.green('Iniciando o cliente...'));

const client = net.createConnection({ port: 3000 }, () => {
    console.log(chalk.green('Conectado ao servidor.'));
});

client.on('data', (data) => {
    // let plaintext = data.toString().trim();
    let plaintext = vigenereDecrypt(data.toString(), "fogo")
    console.log(chalk.blue(`Mensagem recebida: ${plaintext}`));
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
    let encryptedMessage = vigenereEncrypt(input, chave);
    console.log("Mensagem criptografada: " + encryptedMessage);
    client.write(encryptedMessage);
});

function vigenereEncrypt(msg, key) {
    let cryptograma = [];
    key = key.toLowerCase();
    msg = msg.toLowerCase();
    let keyIndex = 0;
  
    for (let i = 0; i < msg.length; i++) {
      let char = msg[i];
  
      if (alfabeto.includes(char)) {
        let keyChar = key[keyIndex];
        let shift = alfabeto.indexOf(keyChar);
        let cryptoCharIndex = (alfabeto.indexOf(char) + shift) % alfabeto.length;
        let cryptoChar = alfabeto[cryptoCharIndex];
        cryptograma.push(cryptoChar);
        keyIndex = (keyIndex + 1) % key.length;
      } else {
        cryptograma.push(char);
      }
    }
  
    return cryptograma.join('');
  }
  
  function vigenereDecrypt(msg, key) {
    let plaintext = [];
    key = key.toLowerCase();
    msg = msg.toLowerCase();
    let keyIndex = 0;
  
    for (let i = 0; i < msg.length; i++) {
      let char = msg[i];
  
      if (alfabeto.includes(char)) {
        let keyChar = key[keyIndex];
        let shift = alfabeto.indexOf(keyChar);
        let charIndex = alfabeto.indexOf(char);
  
        let decryptedCharIndex = (charIndex - shift) % alfabeto.length; // subtract shift before calculating decryptedCharIndex
        if (decryptedCharIndex < 0) {
          decryptedCharIndex += alfabeto.length;
        }
        let decryptedChar = alfabeto[decryptedCharIndex];
        plaintext.push(decryptedChar);
        keyIndex = (keyIndex + 1) % key.length;
      } else {
        plaintext.push(char);
      }
    }
  
    return plaintext.join('');
  }


  function findKey(encryptedMessage, decryptedMessage) {
    for (let key of alfabeto) {
      let encrypted = vigenereEncrypt(decryptedMessage, key);
      if (encrypted === encryptedMessage) {
        return key;
      }
    }
    return null;
  }
  
