import net from 'net';
import readline from 'readline';
import chalk from 'chalk';

let M1 = "Declaramos Paz!";
let key = 'paz';


console.log(chalk.green('Iniciando o cliente...'));

const client = net.createConnection({ port: 3000 }, () => {
    console.log(chalk.green('Conectado ao servidor.'));
});

client.on('data', (data) => {
    let decryptedString = RC4Decrypt(String(data), key);
    if (decryptedString) {
      console.log(chalk.blue(`Mensagem descriptografada: ${decryptedString}`));
  } else {
      console.error(chalk.red("Erro ao descriptografar a mensagem."));
  };
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
    let encryptedString = RC4(input, key);
    console.log("Mensagem criptografada: " + encryptedString);
    client.write(encryptedString);
    let plaintext = RC4Decrypt(encryptedString, key);
    console.log(chalk.blue(`Mensagem que deve ser recbida: ${plaintext}`));
});

function RC4(M1, key) {
  let S = new Array(256);
  let T = new Array(256);

  for (let i = 0; i < 256; i++) {
    S[i] = i;
    T[i] = key.charCodeAt(i % key.length);
  }

  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + T[i]) % 256;
    [S[i], S[j]] = [S[j], S[i]];
  }

  let i = j = 0;
  let encryptedBytes = new Array(M1.length);
  for (let ix = 0; ix < M1.length; ix++) {
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    [S[i], S[j]] = [S[j], S[i]];
    let t = (S[i] + S[j]) % 256;
    encryptedBytes[ix] = M1.charCodeAt(ix) ^ S[t];
  }

  let encryptedString = encryptedBytes.map(byte => String.fromCharCode(byte)).join('');
  return encryptedString;
}

function RC4Decrypt(encryptedString, key) {
  let S = new Array(256);
  let T = new Array(256);

  for (let i = 0; i < 256; i++) {
    S[i] = i;
    T[i] = key.charCodeAt(i % key.length);
  }

  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + T[i]) % 256;
    [S[i], S[j]] = [S[j], S[i]];
  }

  let i = j = 0;
  let decryptedBytes = new Array(encryptedString.length);
  for (let ix = 0; ix < encryptedString.length; ix++) {
    i = (i + 1) % 256;
    j = (j + S[i]) % 256;
    [S[i], S[j]] = [S[j], S[i]];
    let t = (S[i] + S[j]) % 256;
    decryptedBytes[ix] = encryptedString.charCodeAt(ix) ^ S[t];
  }

  let decryptedString = decryptedBytes.map(byte => String.fromCharCode(byte)).join('');
  return decryptedString;
}

