const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

const dataFile = 'data.json';

// Verifica se o arquivo existe e cria se necessário
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]));
}

// Lê o arquivo existente ou o recém-criado
// let data = JSON.parse(fs.readFileSync(dataFile));
let data = [];

app.use(cors());

// Middleware para parsear JSON no corpo da requisição
app.use(express.json());

// Endpoint para enviar mensagens
app.post('/send', (req, res) => {
  // Adiciona a nova mensagem ao array de dados
  data.push(req.body);

  // Grava o novo estado dos dados no arquivo
  // fs.writeFileSync(dataFile, JSON.stringify(data));

  res.sendStatus(200);
});

// Endpoint para simular a consulta ao pool (retorna todos os dados)
app.get('/poll', (req, res) => {
  res.status(200).json(data);
});

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});