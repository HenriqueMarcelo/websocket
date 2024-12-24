const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Armazenamento de mensagens
let messages = [];
let connections = [];

app.use(cors());
app.use(bodyParser.json());

// Endpoint para receber JSONs do cliente
app.post('/send', (req, res) => {
  messages.push(req.body); // Adiciona o JSON recebido à fila
  res.status(200).send({ status: 'Mensagem recebida.' });
});

// Endpoint para polling
app.get('/poll', (req, res) => {
  connections.push(res); // Adiciona a conexão atual à fila de conexões

  // Configura o timeout para fechar a conexão após 30 segundos
  const timeout = setTimeout(() => {
    connections = connections.filter(c => c !== res);
    res.status(200).send([]); // Retorna vazio se nada foi enviado
  }, 30000);

  // Armazena o timeout para que possamos limpar quando a resposta for enviada
  res.on('finish', () => {
    clearTimeout(timeout); // Cancela o timeout caso a resposta já tenha sido enviada
  });
});

// Função para enviar mensagens a todas as conexões pendentes
function sendUpdates() {
  console.log(messages.length, connections.length)
  if (messages.length > 0) {
    connections.forEach(conn => {
      // Verifica se a resposta ainda está pendente
      if (!conn.writableEnded) {
        conn.status(200).send(messages);
      }
    });
    connections = []; // Limpa as conexões após enviar
    messages = []; // Limpa as mensagens após enviá-las
  }
}

// Verifica e envia atualizações a cada segundo
setInterval(sendUpdates, 1000);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
