import {alfabeto} from './crypto.js';

export function vigenereDecrypt(msg, chave) {
    const diferenca = chave.repeat(Math.ceil(msg.length / chave.length));
    const plaintext = [];
  
    for (let i = 0; i < msg.length; i++) {
      const msgChar = msg[i];
      if (msgChar != " ") {
        const keywordChar = chaveRepeating[i];
        const shift = alphabet.indexOf(keywordChar);
    
        const decryptedChar = alphabet[(alphabet.indexOf(msgChar) - shift + 26) % 26];
        plaintext.push(decryptedChar);
      } else {
        plaintext.push(" ");
      }
    }
  

    console.log(plaintext.join(''))

    return plaintext.join('');
  }