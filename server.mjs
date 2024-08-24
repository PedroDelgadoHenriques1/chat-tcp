import net from 'net';
import chalk from 'chalk'; 

const clients = [];

const server = net.createServer((socket) => {
    socket.write(chalk.green('Bem-vindo ao chat!\n'));
    clients.push(socket);

    // Evento quando o servidor recebe dados do cliente
    socket.on('data', (data) => {
        const message = data.toString().trim();
        
        // Exibe a mensagem recebida no console do servidor
        console.log(chalk.blue(`Mensagem recebida: ${message}`));
        
        // Envia a mensagem para todos os outros clientes
        clients.forEach(client => {
            if (client !== socket) {
                client.write(chalk.blue(`Mensagem de um cliente: ${message}`)); 
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
