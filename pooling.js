const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

let data = [];

app.use(cors());

// Middleware para parsear JSON no corpo da requisição
app.use(express.json());

// Endpoint para enviar mensagens
app.post('/send', (req, res) => {
  // Adiciona a nova mensagem ao array de dados
  data.push(req.body);

  res.sendStatus(201);
});

// Endpoint para simular a consulta ao pool (retorna todos os dados)
app.get('/poll', (req, res) => {
  res.status(200).json(data);
});

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});