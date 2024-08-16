import net from 'net'; 
import chalk from 'chalk'; 

const clients = [];

const server = net.createServer((socket) => {
    socket.write(chalk.green('Bem-vindo ao chat!\n'));
    clients.push(socket);

    socket.on('data', (data) => {
        clients.forEach(client => {
            if (client !== socket) {
                client.write(chalk.blue(`Mensagem: ${data}`)); 
            }
        });
    });

    socket.on('end', () => {
        clients.splice(clients.indexOf(socket), 1);
        console.log(chalk.red('Cliente desconectado.')); 
    });

    socket.on('error', (err) => {
        console.error(chalk.red(`Erro: ${err.message}`)); 
    });
});

server.listen(3000, () => {
    console.log(chalk.yellow('Servidor rodando na porta 3000.')); 
});
