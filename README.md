# Chat TCP em Node.js 🗨️

Este é um simples aplicativo de chat TCP construído em Node.js. Ele consiste em duas partes principais: um servidor que retransmite mensagens entre os clientes conectados e os próprios clientes que enviam mensagens através do servidor.

## Funcionalidades

- 📡 **Servidor**: O servidor ouve conexões de clientes e retransmite as mensagens enviadas por qualquer cliente para todos os outros clientes conectados.
- 💬 **Cliente**: Os clientes podem enviar mensagens para o servidor, que as encaminha para todos os outros clientes conectados.
- 🎨 **Chalk**: O projeto utiliza a biblioteca `chalk` para colorir as mensagens no terminal, tornando a experiência mais visualmente agradável.

## Como Usar

### 1. Clonar o Repositório

Clone este repositório em sua máquina local:

```bash
git clone https://github.com/seu-usuario/chat-tcp.git
cd chat-tcp
