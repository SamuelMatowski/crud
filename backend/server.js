const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());


const livrosFile = path.join(__dirname, "livros.json");
const usuariosFile = path.join(__dirname, "usuarios.json");


function lerJSON(file) {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}
function salvarJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}


app.get("/", (req, res) => {
  res.send("🚀 API de Livros e Usuários rodando!");
});


app.get("/livros", (req, res) => {
  const livros = lerJSON(livrosFile);
  res.json(livros);
});


app.post("/livros", (req, res) => {
  const livros = lerJSON(livrosFile);
  const novoLivro = req.body;
  novoLivro.id = livros.length ? livros[livros.length - 1].id + 1 : 1; 
  livros.push(novoLivro);
  salvarJSON(livrosFile, livros);
  res.status(201).json(novoLivro);
});


app.put("/livros/:id", (req, res) => {
  const livros = lerJSON(livrosFile);
  const id = parseInt(req.params.id);
  const index = livros.findIndex(l => l.id === id);

  if (index === -1) return res.status(404).json({ erro: "Livro não encontrado" });

  livros[index] = { ...livros[index], ...req.body, id };
  salvarJSON(livrosFile, livros);
  res.json(livros[index]);
});


app.delete("/livros/:id", (req, res) => {
  const livros = lerJSON(livrosFile);
  const id = parseInt(req.params.id);
  const novosLivros = livros.filter(l => l.id !== id);

  if (novosLivros.length === livros.length)
    return res.status(404).json({ erro: "Livro não encontrado" });

  salvarJSON(livrosFile, novosLivros);
  res.json({ mensagem: "Livro removido com sucesso" });
});


app.get("/usuarios", (req, res) => {
  const usuarios = lerJSON(usuariosFile);
  res.json(usuarios);
});


app.post("/usuarios", (req, res) => {
  const usuarios = lerJSON(usuariosFile);
  const novoUsuario = req.body;
  novoUsuario.id = usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1;
  usuarios.push(novoUsuario);
  salvarJSON(usuariosFile, usuarios);
  res.status(201).json(novoUsuario);
});


app.put("/usuarios/:id", (req, res) => {
  const usuarios = lerJSON(usuariosFile);
  const id = parseInt(req.params.id);
  const index = usuarios.findIndex(u => u.id === id);

  if (index === -1) return res.status(404).json({ erro: "Usuário não encontrado" });

  usuarios[index] = { ...usuarios[index], ...req.body, id };
  salvarJSON(usuariosFile, usuarios);
  res.json(usuarios[index]);
});


app.delete("/usuarios/:id", (req, res) => {
  const usuarios = lerJSON(usuariosFile);
  const id = parseInt(req.params.id);
  const novosUsuarios = usuarios.filter(u => u.id !== id);

  if (novosUsuarios.length === usuarios.length)
    return res.status(404).json({ erro: "Usuário não encontrado" });

  salvarJSON(usuariosFile, novosUsuarios);
  res.json({ mensagem: "Usuário removido com sucesso" });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.use(express.static("public"));
