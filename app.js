// Arquivo Principal do Servidor
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Fernandinha02!', // Altere para sua senha real
  database: 'portfolio'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.stack);
    return;
  }
  console.log('Conectado ao MySQL com ID de conexão:', db.threadId);
});

// Configurações do Express
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROTAS --------------------------------------------

// Página inicial
app.get('/', (req, res) => {
  res.render('index', {
    titulo: 'Meu Portfólio',
    nome: 'Seu Nome' // Altere para seu nome
  });
});

// Página estática com array de projetos de exemplo
app.get('/projetos', (req, res) => {
  const projetos = [
    { nome: 'Projeto 1', descricao: 'Descrição do projeto 1' },
    { nome: 'Projeto 2', descricao: 'Descrição do projeto 2' }
  ];
  res.render('projetos', {
    titulo: 'Meus Projetos',
    projetos
  });
});

// Exibir projetos salvos no banco
app.get('/projects', (req, res) => {
  db.query('SELECT * FROM projects', (err, results) => {
    if (err) {
      console.error('Erro ao buscar projetos:', err);
      return res.status(500).send('Erro ao buscar projetos');
    }
    res.render('projects', {
      titulo: 'Meus Projetos',
      projects: results
    });
  });
});

// Página para adicionar novo projeto
app.get('/projects/new', (req, res) => {
  res.render('new-project', { titulo: 'Novo Projeto' });
});

// Inserir novo projeto
app.post('/projects', (req, res) => {
  const { title, tech, description, link } = req.body;

  if (!title || !tech || !description || !link) {
    console.error('Dados incompletos ao inserir projeto:', req.body);
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  const query = 'INSERT INTO projects (title, tech, description, link) VALUES (?, ?, ?, ?)';
  db.query(query, [title, tech, description, link], (err) => {
    if (err) {
      console.error('Erro ao inserir projeto:', err);
      return res.status(500).send('Erro ao inserir projeto.');
    }
    res.redirect('/projects');
  });
});

// Página para editar projeto
app.get('/projects/edit/:id', (req, res) => {
  const projectId = req.params.id;

  db.query('SELECT * FROM projects WHERE id = ?', [projectId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar projeto para edição:', err);
      return res.status(500).send('Erro ao buscar projeto.');
    }

    if (results.length === 0) {
      return res.status(404).send('Projeto não encontrado.');
    }

    res.render('edit-project', {
      titulo: 'Editar Projeto',
      project: results[0]
    });
  });
});

// Atualizar projeto
app.post('/projects/update/:id', (req, res) => {
  const projectId = req.params.id;
  const { title, tech, description, link } = req.body;

  if (!title || !tech || !description || !link) {
    console.error('Dados incompletos ao atualizar projeto:', req.body);
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  const query = 'UPDATE projects SET title=?, tech=?, description=?, link=? WHERE id=?';
  db.query(query, [title, tech, description, link, projectId], (err) => {
    if (err) {
      console.error('Erro ao atualizar projeto:', err);
      return res.status(500).send('Erro ao atualizar projeto.');
    }
    res.redirect('/projects');
  });
});

// Excluir projeto
app.post('/projects/delete/:id', (req, res) => {
  const projectId = req.params.id;

  db.query('DELETE FROM projects WHERE id = ?', [projectId], (err) => {
    if (err) {
      console.error('Erro ao excluir projeto:', err);
      return res.status(500).send('Erro ao excluir projeto.');
    }
    res.redirect('/projects');
  });
});

// MIDDLEWARES --------------------------------------------

// Rota 404
app.use((req, res) => {
  res.status(404).send('Desculpe, página não encontrada.');
});

// Erro interno
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erro interno do servidor.');
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
