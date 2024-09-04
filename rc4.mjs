let M1 = "Declaramos Paz!";
let key = 'paz';

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


let resultado = RC4(M1, key);
console.log(resultado);

let encryptedString = resultado; // use the encrypted string from the previous output
let decryptedString = RC4Decrypt(encryptedString, key);
console.log(decryptedString);
