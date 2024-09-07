import net from 'net';
import readline from 'readline';
import chalk from 'chalk';


// let key = 'D&Ot)[YW';
// let key = String.fromCharCode(36, 64, 67, 42, 57, 41, 54, 67, 123, 52, 94, 100, 88, 78, 119, 62, 72, 35, 87, 44, 98, 101, 47, 92, 39, 76, 50, 112, 77, 56, 114, 59, 74, 89, 63, 120, 125, 66, 93, 64, 65, 96, 84, 33, 113, 63, 105, 79, 96, 61, 110, 46, 76, 103, 109, 40, 51, 122, 56, 64, 83, 91, 117, 93, 100, 89, 49, 107, 124, 37, 82, 73, 33, 77, 80, 45, 40, 70, 116, 90, 108, 38, 94, 51, 58, 106, 110, 75, 60, 84, 71, 54, 91, 53, 74, 119, 125);
let key = String.fromCharCode(48, 90, 33, 42, 37, 49, 80, 95, 51, 66, 125, 57, 109, 126, 86, 48, 64, 72, 94, 81, 102, 55, 121, 38, 90, 52, 87, 98, 62, 107, 83, 94, 84, 60, 100, 46, 36, 46, 112, 76, 64, 82, 124, 103, 41, 120, 41, 45, 54, 40, 69, 38, 104, 37, 84, 45, 125, 40, 87, 37, 122, 123, 85, 57, 109, 90, 122, 56, 126, 109, 56, 66, 102, 80, 33, 99, 38, 64, 107, 55, 73, 92, 53, 73, 126, 84, 95, 118, 68, 33, 52, 65, 62, 124, 111, 79, 91, 125, 51, 42, 84, 124, 36, 63, 101, 126, 48, 93, 86, 53, 38, 121, 64, 114, 49, 88, 50, 107, 43, 64, 84, 93, 106, 63, 124, 50, 124, 81, 37, 125, 82, 44, 68, 41, 85, 112, 92, 56, 103, 77, 59, 87, 125, 124, 55, 101, 78, 70, 107, 94, 116, 46, 104, 47, 106, 59, 54, 35, 121, 45, 33, 116, 53, 41, 92, 94, 76, 74, 91, 55, 83, 60, 52, 65, 44, 102, 36, 75, 115, 49, 124, 38, 115, 88, 33, 119, 42, 71, 40, 90, 64, 105, 62, 106, 69, 62, 54, 126, 93, 111, 65, 53, 93, 107, 39, 46, 58, 111, 61, 55, 110, 57, 104, 41, 36, 74, 95, 33, 97, 66, 123, 78, 45, 74, 98, 49, 77, 125, 78, 122, 68, 92, 42, 104);

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
    console.log(chalk.blue(`Mensagem que deve ser recebida: ${plaintext}`));
});

function RC4(text, key) {
  let S = Array.from({ length: 256 }, (_, i) => i);
  let j = 0;

  for (let i = 0; i < 256; i++) { // Key Scheduling Algorithm (KSA)
      j = (j + S[i] + key.charCodeAt(i % key.length)) % 256;
      [S[i], S[j]] = [S[j], S[i]];
  }

  let i = 0;
  j = 0;
  let result = '';

  for (let char of text) { // Pseudo-Random Generation Algorithm (PRGA)
      i = (i + 1) % 256;
      j = (j + S[i]) % 256;
      [S[i], S[j]] = [S[j], S[i]];
      let t = (S[i] + S[j]) % 256;
      result += String.fromCharCode(char.charCodeAt(0) ^ S[t]);
  }

  return result;
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


function Test1() {
  let key = "D&Ot)[YW";
  let plaintext = "Cybersecurity melhor disciplina do curso.";
  
  let encrypted = RC4(plaintext, key);
  console.log("Encriptografado:", encrypted);

  let decrypted = RC4(encrypted, key);
  console.log("Descriptografado:", decrypted);

  let inputString = "Ö nmtû ûLÁý¨IAÅRH]Dú7∟Ê;Mº↑06j&RÖÞ¶¶ ";
  let asciiValues = [];
  
  for (let i = 0; i < inputString.length; i++) {
      asciiValues.push(inputString.charCodeAt(i));
  }
  
  console.log(asciiValues);
}

function Test2() {
  let k2 = String.fromCharCode(36, 64, 67, 42, 57, 41, 54, 67, 123, 52, 94, 100, 88, 78, 119, 62, 72, 35, 87, 44, 98, 101, 47, 92, 39, 76, 50, 112, 77, 56, 114, 59, 74, 89, 63, 120, 125, 66, 93, 64, 65, 96, 84, 33, 113, 63, 105, 79, 96, 61, 110, 46, 76, 103, 109, 40, 51, 122, 56, 64, 83, 91, 117, 93, 100, 89, 49, 107, 124, 37, 82, 73, 33, 77, 80, 45, 40, 70, 116, 90, 108, 38, 94, 51, 58, 106, 110, 75, 60, 84, 71, 54, 91, 53, 74, 119, 125);
  let plaintext = "Cybersecurity melhor disciplina do curso.";  

  let encrypted = RC4(plaintext, k2);
  console.log("Encriptografado:", encrypted);

  let decrypted = RC4(encrypted, k2);
  console.log("Descriptografado:", decrypted);

  let inputString = encrypted;
  let asciiValues = [];
  
  for (let i = 0; i < inputString.length; i++) {
      asciiValues.push(inputString.charCodeAt(i));
  }
  
  console.log(asciiValues);
}

function Test3() {
  let key3 = String.fromCharCode(48, 90, 33, 42, 37, 49, 80, 95, 51, 66, 125, 57, 109, 126, 86, 48, 64, 72, 94, 81, 102, 55, 121, 38, 90, 52, 87, 98, 62, 107, 83, 94, 84, 60, 100, 46, 36, 46, 112, 76, 64, 82, 124, 103, 41, 120, 41, 45, 54, 40, 69, 38, 104, 37, 84, 45, 125, 40, 87, 37, 122, 123, 85, 57, 109, 90, 122, 56, 126, 109, 56, 66, 102, 80, 33, 99, 38, 64, 107, 55, 73, 92, 53, 73, 126, 84, 95, 118, 68, 33, 52, 65, 62, 124, 111, 79, 91, 125, 51, 42, 84, 124, 36, 63, 101, 126, 48, 93, 86, 53, 38, 121, 64, 114, 49, 88, 50, 107, 43, 64, 84, 93, 106, 63, 124, 50, 124, 81, 37, 125, 82, 44, 68, 41, 85, 112, 92, 56, 103, 77, 59, 87, 125, 124, 55, 101, 78, 70, 107, 94, 116, 46, 104, 47, 106, 59, 54, 35, 121, 45, 33, 116, 53, 41, 92, 94, 76, 74, 91, 55, 83, 60, 52, 65, 44, 102, 36, 75, 115, 49, 124, 38, 115, 88, 33, 119, 42, 71, 40, 90, 64, 105, 62, 106, 69, 62, 54, 126, 93, 111, 65, 53, 93, 107, 39, 46, 58, 111, 61, 55, 110, 57, 104, 41, 36, 74, 95, 33, 97, 66, 123, 78, 45, 74, 98, 49, 77, 125, 78, 122, 68, 92, 42, 104);
  let plaintext = "Cybersecurity melhor disciplina do curso.";

  let encrypted = RC4(plaintext, key3);
  console.log("Encriptografado:", encrypted);

  let decrypted = RC4(encrypted, key3);
  console.log("Descriptografado:", decrypted);

  let inputString = encrypted;
  let asciiValues = [];
  
  for (let i = 0; i < inputString.length; i++) {
      asciiValues.push(inputString.charCodeAt(i));
  }
  
  console.log(asciiValues);
}

// Test1();
// Test2();
// Test3();