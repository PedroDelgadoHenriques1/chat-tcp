import readline from 'readline';

// Função para criptografar o texto usando a cifra monoalfabética
function monoAlfabeticas(text, substitution) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';

    // Verifica se o alfabeto de substituição é válido
    if (!validateSubstitution(substitution)) {
        throw new Error('O alfabeto de substituição deve ter 26 letras únicas.');
    }

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        let lowerChar = char;

        // Converte o caractere para minúsculo manualmente
        if (char >= 'A' && char <= 'Z') {
            lowerChar = String.fromCharCode(char.charCodeAt(0) + 32);
        }

        // Encontra o índice do caractere manualmente
        let index = -1;
        for (let j = 0; j < alphabet.length; j++) {
            if (alphabet[j] === lowerChar) {
                index = j;
                break;
            }
        }

        if (index !== -1) {
            // Adiciona o caractere substituído ao resultado
            let substitutionChar = substitution[index];

            // Mantém a capitalização original do caractere
            if (char >= 'A' && char <= 'Z') {
                substitutionChar = substitutionChar.toUpperCase();
            }

            result += substitutionChar;
        } else {
            // Mantém caracteres não alfabéticos inalterados
            result += char;
        }
    }

    return result;
}

// Função para validar o alfabeto de substituição
function validateSubstitution(substitution) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    // Verifica se o alfabeto de substituição tem o tamanho correto e contém letras únicas
    if (substitution.length !== alphabet.length) {
        return false;
    }

    let charSet = new Set();

    for (let i = 0; i < substitution.length; i++) {
        let char = substitution[i];

        // Converte o caractere para minúsculo manualmente
        if (char >= 'A' && char <= 'Z') {
            char = String.fromCharCode(char.charCodeAt(0) + 32);
        }

        if (charSet.has(char)) {
            return false;
        }

        charSet.add(char);
    }

    return true;
}

// Configura a interface para leitura do usuário
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função para solicitar entrada do usuário e criptografar o texto
function start() {
    rl.question('Digite o texto a ser criptografado: ', (text) => {
        rl.question('Digite o alfabeto de substituição (26 letras únicas): ', (substitution) => {
            try {
                const encryptedText = monoAlfabeticas(text, substitution);
                console.log('Texto criptografado:', encryptedText);
            } catch (error) {
                console.error('Erro:', error.message);
            } finally {
                rl.close();
            }
        });
    });
}

start();
