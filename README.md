Chat TCP em Node.js
Este projeto implementa um chat simples utilizando sockets TCP em Node.js. Ele consiste em um servidor que gerencia as conexões dos clientes e permite que eles troquem mensagens entre si. O projeto utiliza a biblioteca chalk para formatar a saída no terminal com cores.

Funcionalidades
Servidor TCP que aceita conexões de múltiplos clientes.
Mensagens de Broadcast: Quando um cliente envia uma mensagem, ela é retransmitida para todos os outros clientes conectados.
Mensagens Coloridas: As mensagens e notificações são exibidas com cores no terminal para facilitar a leitura.
Pré-requisitos
Node.js instalado na máquina.
Instalação
Clone o repositório:

entrar na pasta node_modules e executar o npm install

Conectando Clientes
Em outro terminal, inicie um cliente:

bash
Copiar código
node client.mjs
Digite mensagens no terminal do cliente e elas serão enviadas ao servidor, que fará o broadcast para todos os outros clientes conectados.

Testando
Abra múltiplos terminais e execute node client.mjs em cada um para simular diferentes clientes conectados ao mesmo servidor.
As mensagens enviadas por um cliente aparecerão em todos os terminais dos outros clientes.
Estrutura do Projeto
server.mjs: Código do servidor TCP.
client.mjs: Código do cliente TCP.
package.json: Arquivo de configuração do Node.js com as dependências do projeto.
package-lock.json: Gerenciado automaticamente pelo npm para manter a consistência das versões das dependências.
.gitignore: Arquivo que especifica os arquivos e diretórios a serem ignorados pelo Git.
Dependências
chalk: Biblioteca para adicionar cores ao terminal.
net: Módulo nativo do Node.js para criar servidores e clientes TCP.
readline: Módulo nativo do Node.js para ler entradas de dados no terminal.


---

Cifras simétricas:

> Chave Nome (args*)

- Csr César (mensagem, voltas)
- Mn Monoalfabética (mensagem, alfabeto)
- Pfr Playfair (inicializa, mensagem, chave)
- Vgr Vigenere (mensagem, chave fixa no código)
- - Rc4


  cifras assimétricas:

  - Des
