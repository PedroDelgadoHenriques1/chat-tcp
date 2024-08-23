import {vigenereDecrypt} from './decrypto.js';

export const alfabeto = 'abcdefghijklmnopqrstuvwxyz';

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

// x =  cesar("quiabo", 26)

// console.log(x)

function vigenere(msg, chave) {
    chave = chave.repeat(Math.ceil(msg.length / chave.length))
    let cryptograma = []
 
    for (var i = 0; i < msg.length; i++) {
        let char = msg[i]

        if (char != " ") {
            let chaveChar = chave[i]
            let diferenca = alfabeto.indexOf(chaveChar);
            let crytoChar = alfabeto[(alfabeto.indexOf(char) + diferenca) % alfabeto.length];

            cryptograma.push(crytoChar)
        } else {
            cryptograma.push(" ")
        }

    }

    console.log(`${cryptograma.join('')}`)
}


vigenere("pedrao gosta de tomar acai", "fogo");

vigenereDecrypt("usjffc utgzo rk ycsow gqfw", "fogo");