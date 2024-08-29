import net from 'net';
import readline from 'readline';
import chalk from 'chalk';

console.log(chalk.green('Iniciando o cliente...'));

const key = "fogo"

const client = net.createConnection({ port: 3000 }, () => {
    console.log(chalk.green('Conectado ao servidor.'));
});

client.on('data', (data) => {
    const encryptedMessage = data.toString('utf8');
    let plaintext = descriptografarPlayfair(encryptedMessage, key)
    if (plaintext) {
        console.log(chalk.blue(`Mensagem descriptografada: ${plaintext}`));
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
        rl.question('chave: ', (key) => {
            let x = criptografarPlayfair(input, key)
            console.log(`${x}`);
            client.write(x);
            console.log(`texto plano ${descriptografarPlayfair(input, key)}`);
        });      
});

function criarMatrizPlayfair(chave) {
    const alfabeto = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    let matriz = [];
    let used = {};
  
    for (let char of chave.toUpperCase()) {
      if (!used[char]) {
        matriz.push(char);
        used[char] = true;
      }
    }
  
    for (let char of alfabeto) {
      if (!used[char]) {
        matriz.push(char);
      }
    }
  

    return matriz.reduce((acc, char, index) => {
      if (index % 5 === 0) {
        acc.push([]);
      }
      acc[acc.length - 1].push(char);
      return acc;
    }, []);
  }
  
  function encontrarIndices(matriz, letra) {
    for (let i = 0; i < matriz.length; i++) {
      for (let j = 0; j < matriz[i].length; j++) {
        if (matriz[i][j] === letra) {
          return [i, j];
        }
      }
    }
    return [-1, -1]; 
  }
  
  function criptografarPlayfair(texto, chave) {
    const matriz = criarMatrizPlayfair(chave);
    let textoCifrado = '';
    let diagrama = '';
  
    for (let i = 0; i < texto.length; i++) {
      const char = texto[i].toUpperCase();
      if (char === 'J') diagrama += 'I';
      else diagrama += char;
  
      if (diagrama.length === 2) {
        const [i1, j1] = encontrarIndices(matriz, diagrama[0]);
        const [i2, j2] = encontrarIndices(matriz, diagrama[1]);
  
        if (i1 === i2) { // Mesma linha
          textoCifrado += matriz[i1][(j1 + 1) % 5] + matriz[i2][(j2 + 1) % 5];
        } else if (j1 === j2) { // Mesma coluna
          textoCifrado += matriz[(i1 + 1) % 5][j1] + matriz[(i2 + 1) % 5][j2];
        } else { // Diferentes linha e coluna
          textoCifrado += matriz[i1][j2] + matriz[i2][j1];
        }
        diagrama = '';
      }
    }
  
    return textoCifrado;
  }
  
  function descriptografarPlayfair(textoCifrado, chave) {
    const matriz = criarMatrizPlayfair(chave);
    let textoClaro = '';
    let diagrama = '';
  
    for (let i = 0; i < textoCifrado.length; i += 2) {
      const char1 = textoCifrado[i].toUpperCase();
      const char2 = textoCifrado[i + 1].toUpperCase();
  
      // Verificar se os caracteres são válidos e se o texto cifrado tem comprimento par
      if (!/[A-Z]/.test(char1) || !/[A-Z]/.test(char2)) {
        console.error("Caractere inválido no texto cifrado.");
        textoClaro += ' ';
        return;
      }
  
      const [i1, j1] = encontrarIndices(matriz, char1);
      const [i2, j2] = encontrarIndices(matriz, char2);

      console.log([i1, j1])
      console.log([i2, j2])

  
      if (i1 === i2) { // Mesma linha
        textoClaro += matriz[i1][(j1 - 1 + 5) % 5] + matriz[i2][(j2 - 1 + 5) % 5];
      } else if (j1 === j2) { // Mesma coluna
        textoClaro += matriz[(i1 - 1 + 5) % 5][j1] + matriz[(i2 - 1 + 5) % 5][j2];
      } else { // Diferentes linha e coluna
        textoClaro += matriz[i1][j2] + matriz[i2][j1];
      }
      diagrama = '';
    }
  
    return textoClaro;
  }