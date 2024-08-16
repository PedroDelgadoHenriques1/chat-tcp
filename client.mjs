import net from 'net';
import readline from 'readline';
import chalk from 'chalk';

console.log(chalk.green('Iniciando o cliente...'));

const client = net.createConnection({ port: 3000 }, () => {
    console.log(chalk.green('Conectado ao servidor.'));
});

client.on('data', async(data) => {
    console.log(chalk.blue(`cifra será alterada`));
    console.log(chalk.blue(`${data}`));
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
    client.write(chalk.yellow(input));
});
