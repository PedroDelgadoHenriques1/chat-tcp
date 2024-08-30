import net from 'net';
import readline from 'readline';
import chalk from 'chalk';

const chave = 'zbcdefghijklmnopqrstuvwxya'
const substitution = 'zbcdefghijklmnopqrstuvwxya'

console.log(chalk.green('Iniciando o cliente...'));

const client = net.createConnection({ port: 3000 }, () => {
    console.log(chalk.green('Conectado ao servidor.'));
});

client.on('data', (data) => {
    const encryptedMessage = data.toString().trim();
    const substitution = 'abcdefghijklmnopqrstuvwxyz';
    let plaintext = monoAlfabeticasDecrypt(encryptedMessage, chave);
    console.log(chalk.blue(`${plaintext}`));
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
    let encryptedMsg = monoAlfabeticas(input, substitution);
    console.log(`Mensagem criptografada: ${encryptedMsg}`);
    client.write(encryptedMsg);
    });

function monoAlfabeticas(text, substitution) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';

    if (!validateSubstitution(substitution)) {
        throw new Error('O alfabeto de substituição deve ter 26 letras únicas.');
    }

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const index = alphabet.indexOf(char.toLowerCase());

        if (index !== -1) {
            result += substitution[index];
        } else {
            result += char;
        }
    }

    return result;
}

function monoAlfabeticasDecrypt(encryptedText, substitution) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';

    // Verifica se a substituição é válida
    if (!substitution || substitution.length !== 26) {
        throw new Error('O alfabeto de substituição deve ter 26 letras únicas.');
    }

    // Percorre cada caractere do texto criptografado
    for (let i = 0; i < encryptedText.length; i++) {
        const char = encryptedText[i];
        const index = substitution.indexOf(char.toLowerCase());

        if (index !== -1) {
            // Mapeia o caractere criptografado de volta para o alfabeto original
            result += alphabet[index];
        } else {
            // Mantém caracteres não alfabéticos inalterados
            result += char;
        }
    }

    return result;
}

function validateSubstitution(substitution) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    return substitution.length === alphabet.length && new Set(substitution).size === alphabet.length;
}
