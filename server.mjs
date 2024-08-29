import net from 'net';
import chalk from 'chalk'; 

const clients = [];

const server = net.createServer((socket) => {
    clients.push(socket);
    const user = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(chalk.green(`Cliente ${user} se conectou.`));

    socket.on('data', (data) => {
        const message = data;

        console.log(chalk.blue(`${user}: ${message}`));

        clients.forEach(client => {
            if (client !== socket) {
                client.write(`${message}`);
            }
        });
    });


    socket.on('end', () => {
        clients.splice(clients.indexOf(socket), 1);
        console.log(chalk.red(`Cliente ${user} desconectado.`));
    });

    socket.on('error', (err) => {
        console.error(chalk.red(`Erro: ${err.message}`));
    });
});

server.listen(3000, () => {
    console.log(chalk.yellow('Servidor rodando na porta 3000.'));
});
