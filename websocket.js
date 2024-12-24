const WebSocket = require('ws');
const port = 3001;
const wss = new WebSocket.Server({ port });

let data = [];

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Envia todos os dados existentes para o novo cliente
  ws.send(JSON.stringify(data));

  ws.on('message', (dataMessage) => {
    const message = JSON.parse(dataMessage);
    // Adiciona a nova mensagem ao array de dados
    data.push(message);

    // Envia a nova mensagem para todos os clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
});

console.log(`Servidor ws iniciado na porta ${port}`);