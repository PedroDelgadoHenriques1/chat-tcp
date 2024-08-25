import net from 'net';
import readline from 'readline';
import chalk from 'chalk';

console.log(chalk.green('Iniciando o cliente...'));

const client = net.createConnection({ port: 3000 }, () => {
    console.log(chalk.green('Conectado ao servidor.'));
});

client.on('data', (data) => {
    client.question('chave: ', (key) => {
        let t2 = decryptMessage(key, data)
        console.log(chalk.blue(`Mensagem: ${t2}`));
    }); 
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
    if (input === 'playfair') {
        rl.question('Mensagem: ', (msg) => {
            rl.question('voltas: ', (key) => {
                let x = playfairCipher(key, answer)
                console.log(`${x}`);
                client.write(x);
            });      
        });   
    } else {
        client.write(input);
    }
});


