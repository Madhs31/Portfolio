/* Arquivo Principal do Servidor */
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Fernandinha02!',
  database: 'portfolio'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MySQL');
});

// Configurações do Express
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Rota principal
app.get('/', (req, res) => {
  res.render('index', { titulo: 'Meu Portfólio', nome: 'Seu Nome' });
});

// Rota fixa de projetos (exemplo com array)
app.get('/projetos', (req, res) => {
  const projetos = [
    { nome: 'Projeto 1', descricao: 'Descrição do projeto 1' },
    { nome: 'Projeto 2', descricao: 'Descrição do projeto 2' }
  ];
  res.render('projetos', { titulo: 'Meus Projetos', projetos });
});

// Mostrar projetos salvos no banco
app.get('/projects', (req, res) => {
  db.query('SELECT * FROM projects', (err, results) => {
    if (err) throw err;
    res.render('projects', { titulo: 'Meus Projetos', projects: results });
  });
});

// Página para adicionar novo projeto
app.get('/projects/new', (req, res) => {
  res.render('new-project', { titulo: 'Novo Projeto' });
});

// Inserir novo projeto no banco
app.post('/projects', (req, res) => {
  const { title, tech, description, link } = req.body;
  db.query(
    'INSERT INTO projects (title, tech, description, link) VALUES (?, ?, ?, ?)',
    [title, tech, description, link],
    (err) => {
      if (err) throw err;
      res.redirect('/projects');
    }
  );
});

// Página para editar projeto existente
app.get('/projects/edit/:id', (req, res) => {
  db.query('SELECT * FROM projects WHERE id = ?', [req.params.id], (err, results) => {
    if (err) throw err;
    res.render('edit-project', { titulo: 'Editar Projeto', project: results[0] });
  });
});

// Atualizar projeto
app.post('/projects/update/:id', (req, res) => {
  const { title, tech, description, link } = req.body;
  db.query(
    'UPDATE projects SET title=?, tech=?, description=?, link=? WHERE id=?',
    [title, tech, description, link, req.params.id],
    (err) => {
      if (err) throw err;
      res.redirect('/projects');
    }
  );
});

// Excluir projeto
app.post('/projects/delete/:id', (req, res) => {
  db.query('DELETE FROM projects WHERE id=?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/projects');
  });
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
