import net from 'net';
import chalk from 'chalk'; 

const clients = [];

const server = net.createServer((socket) => {
    console.log(chalk.green('Um cliente se conectou.'));
    clients.push(socket);

    socket.on('data', (data) => {
        const message = data.toString('utf8').trim();
        const user = `${socket.remoteAddress}:${socket.remotePort}`;

        console.log(chalk.blue(`${user}: ${message}`));
        
        // Envia a mensagem para todos os outros clientes
        clients.forEach(client => {
            if (client !== socket) {
                client.write(`${user}: ${message}`);
            }
        });
    });

    // Evento quando um cliente desconecta
    socket.on('end', () => {
        clients.splice(clients.indexOf(socket), 1);
        console.log(chalk.red('Cliente desconectado.'));
    });

    // Evento quando ocorre um erro
    socket.on('error', (err) => {
        console.error(chalk.red(`Erro: ${err.message}`));
    });
});

server.listen(3000, () => {
    console.log(chalk.yellow('Servidor rodando na porta 3000.'));
});
