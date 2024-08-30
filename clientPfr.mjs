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

rl.on('line', (input) => {
    rl.question('Mensagem: ', (msg) => {
        rl.question('Chave: ', (key) => {
            let textoCifrado = criptografarPlayfair(msg, key);
            console.log(`Texto cifrado: ${textoCifrado}`);
            let textoDescriptografado = descriptografarPlayfair(textoCifrado, key);
            console.log(`Texto descriptografado: ${textoDescriptografado}`);
            client.write(textoCifrado);
        });
    });
});

function criarMatrizPlayfair(chave) {
    const alfabeto = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // I e J combinados
    let matriz = [];
    let used = {};

    // Adiciona a chave à matriz, removendo duplicatas
    for (let char of chave.toUpperCase()) {
        if (!used[char] && alfabeto.includes(char)) {
            matriz.push(char);
            used[char] = true;
        }
    }

    // Adiciona as letras restantes do alfabeto à matriz
    for (let char of alfabeto) {
        if (!used[char]) {
            matriz.push(char);
        }
    }

    // Forma a matriz 5x5
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
    return [-1, -1]; // Letra não encontrada
}

function criptografarPlayfair(texto, chave) {
    const matriz = criarMatrizPlayfair(chave);
    let textoCifrado = '';
    let digrama = '';

    for (let i = 0; i < texto.length; i++) {
        const char = texto[i].toUpperCase();
        
        if (char === ' ') { // Mantém os espaços
            textoCifrado += ' ';
            continue;
        }

        digrama += char;

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

    if (digrama.length === 1) {
        textoCifrado += digrama + 'X'; // Adiciona 'X' se restar um caractere
    }

    return textoCifrado;
}

function descriptografarPlayfair(textoCifrado, chave) {
    const matriz = criarMatrizPlayfair(chave);
    let textoClaro = '';
    let digrama = '';

    for (let i = 0; i < textoCifrado.length; i += 2) {
        const char1 = textoCifrado[i];
        const char2 = textoCifrado[i + 1];

        if (char1 === ' ') {
            textoClaro += ' ';
            i--; // Compensa o incremento duplo
            continue;
        }

        const [i1, j1] = encontrarIndices(matriz, char1.toUpperCase());
        const [i2, j2] = encontrarIndices(matriz, char2.toUpperCase());

        if (i1 === i2) {
            textoClaro += matriz[i1][(j1 - 1 + 5) % 5] + matriz[i2][(j2 - 1 + 5) % 5];
        } else if (j1 === j2) {
            textoClaro += matriz[(i1 - 1 + 5) % 5][j1] + matriz[(i2 - 1 + 5) % 5][j2];
        } else {
            textoClaro += matriz[i1][j2] + matriz[i2][j1];
        }
    }

    return textoClaro;
}
