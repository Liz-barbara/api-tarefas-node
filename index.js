const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let tarefas = [];
let nextId = 1;

// Criando a tarefa com um desafio adicional de no mínimo 10 caracteres
app.post('/tarefas', (req, res) => {
  const { titulo, descricao, status } = req.body;

  if (typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({ error: 'O título é obrigatório e deve ser uma string.' });
  }
  if (typeof descricao !== 'string' || descricao.trim() === '' || descricao.length < 10) {
    return res.status(400).json({ error: 'A descrição é obrigatória, deve ser uma string e ter no mínimo 10 caracteres.' });
  }
  if (typeof status !== 'boolean') {
    return res.status(400).json({ error: 'O status deve ser um valor booleano.' });
  }

  const novaTarefa = {
    id: nextId++,
    titulo,
    descricao,
    status,
    dataCriacao: new Date()
  };
  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
});

// Listando a tarefa com desafio adicional de filtro
app.get('/tarefas', (req, res) => {
  let resultado = tarefas;

  // Filtro
  if (req.query.status) {
    if (req.query.status === 'true') {
      resultado = resultado.filter(t => t.status === true);
    } else if (req.query.status === 'false') {
      resultado = resultado.filter(t => t.status === false);
    }
  }

  // Desafio adicional de ordenação por campo
  if (req.query.sort) {
    if (req.query.sort === 'dataCriacao') {
      resultado = resultado.sort((a, b) => new Date(a.dataCriacao) - new Date(b.dataCriacao));
    } else if (req.query.sort === 'status') {
      resultado = resultado.sort((a, b) => a.status - b.status);
    }
  }

  res.json(resultado);
});

app.get('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }
  res.json(tarefa);
});

app.put('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  const { titulo, descricao, status } = req.body;

  if (typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({ error: 'O título é obrigatório e deve ser uma string.' });
  }
  if (typeof descricao !== 'string' || descricao.trim() === '' || descricao.length < 10) {
    return res.status(400).json({ error: 'A descrição é obrigatória, deve ser uma string e ter no mínimo 10 caracteres.' });
  }
  if (typeof status !== 'boolean') {
    return res.status(400).json({ error: 'O status deve ser um valor booleano.' });
  }

  tarefa.titulo = titulo;
  tarefa.descricao = descricao;
  tarefa.status = status;

  res.json(tarefa);
});

app.delete('/tarefas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tarefas.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }
  tarefas.splice(index, 1);
  res.json({ message: 'Tarefa excluída com sucesso.' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
