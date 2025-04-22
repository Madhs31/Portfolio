/* Arquivo Principal do Servidor */ 

const express = require('express');
const app = express();
const port = 3000;

// Configura EJS como template engine
app.set('view engine', 'ejs');

// Configura a pasta de arquivos estáticos
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
  res.render('index', { titulo: 'Meu Portfólio', nome: 'Seu Nome' });
});

// Rota de projetos
app.get('/projetos', (req, res) => {
  const projetos = [
    { nome: 'Projeto 1', descricao: 'Descrição do projeto 1' },
    { nome: 'Projeto 2', descricao: 'Descrição do projeto 2' },
  ];

  res.render('projetos', { titulo: 'Meus Projetos', projetos });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
