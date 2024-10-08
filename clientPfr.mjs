import net from 'net';
import readline from 'readline';
import chalk from 'chalk';

console.log(chalk.green('Iniciando o cliente...'));

const key = "fogo";

const client = net.createConnection({ port: 3000 }, () => {
    console.log(chalk.green('Conectado ao servidor.'));
});

client.on('data', (data) => {
    const encryptedMessage = data.toString('utf8');
    let plaintext = descriptografarPlayfair(encryptedMessage, key);
    if (plaintext) {
        console.log(chalk.blue(`Mensagem descriptografada: ${plaintext}`));
    } else {
        console.error(chalk.red("Erro ao descriptografar a mensagem."));
    }
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

rl.question('Digite a mensagem: ', (input) => {
        let x = criptografarPlayfair(input, key);
        console.log(`Mensagem criptografada: ${x}`);
        let y = descriptografarPlayfair(x, key);
        console.log(`Texto plano: ${y}`);
        client.write(x);
});

function criarMatrizPlayfair(chave) {
    const alfabeto = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    let matriz = [];
    let used = {};

    for (let char of chave.toUpperCase()) {
        if (!used[char] && char !== ' ') {
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
            if (matriz[i][j] === letra.toUpperCase()) {
                return [i, j];
            }
        }
    }
    return [-1, -1];
}

function criptografarPlayfair(texto, chave) {
    const matriz = criarMatrizPlayfair(chave);
    let textoCifrado = '';
    let digrama = '';
    let textoSemEspacos = texto.replace(/ /g, '');

    
    if (textoSemEspacos.length % 2 !== 0) {
        textoSemEspacos += 'X';
    }

    // Adiciona um caractere de preenchimento se o comprimento do texto for ímpar
    if (textoSemEspacos.length % 2 !== 0) {
        textoSemEspacos += 'X'; // 'X' é um caractere de preenchimento comum
    }

    for (let i = 0; i < textoSemEspacos.length; i++) {
        const char = textoSemEspacos[i];
        const charUpper = char.toUpperCase();
        if (charUpper === 'J') digrama += 'I';
        else digrama += charUpper;

        if (digrama.length === 2) {
            const [i1, j1] = encontrarIndices(matriz, digrama[0]);
            const [i2, j2] = encontrarIndices(matriz, digrama[1]);

            if (i1 === i2) {
                textoCifrado += matriz[i1][(j1 + 1) % 5] + matriz[i2][(j2 + 1) % 5];
            } else if (j1 === j2) {
                textoCifrado += matriz[(i1 + 1) % 5][j1] + matriz[(i2 + 1) % 5][j2];
            } else {
                textoCifrado += matriz[i1][j2] + matriz[i2][j1];
            }
            digrama = '';
        }
    }

    return textoCifrado;
}

function descriptografarPlayfair(textoCifrado, chave) {
    const matriz = criarMatrizPlayfair(chave);
    let textoClaro = '';
    let textoSemEspacos = textoCifrado.replace(/ /g, '');

    if (textoSemEspacos.length % 2 !== 0) {
        console.error("Texto cifrado tem comprimento ímpar.");
        return;
    }

    for (let i = 0; i < textoSemEspacos.length; i += 2) {
        const char1 = textoSemEspacos[i].toUpperCase();
        const char2 = textoSemEspacos[i + 1]?.toUpperCase();

        if (!/[A-Z]/.test(char1) || !/[A-Z]/.test(char2)) {
            console.error("Caractere inválido no texto cifrado.");
            return;
        }

        const [i1, j1] = encontrarIndices(matriz, char1);
        const [i2, j2] = encontrarIndices(matriz, char2);

        if (i1 === i2) {
            textoClaro += matriz[i1][(j1 - 1 + 5) % 5] + matriz[i2][(j2 - 1 + 5) % 5];
        } else if (j1 === j2) {
            textoClaro += matriz[(i1 - 1 + 5) % 5][j1] + matriz[(i2 - 1 + 5) % 5][j2];
        } else {
            textoClaro += matriz[i1][j2] + matriz[i2][j1];
        }
    }

    textoClaro = textoClaro.replace(/X$/, '');

    return textoClaro;
}
