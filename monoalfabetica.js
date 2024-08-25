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
        const index = alphabet.indexOf(char.toLowerCase());

        if (index !== -1) {
            // Adiciona o caractere substituído ao resultado
            result += substitution[index];
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
    return substitution.length === alphabet.length && new Set(substitution).size === alphabet.length;
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



