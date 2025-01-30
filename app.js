const express = require('express'); // importa o express
const cors = require('cors'); // importa o cors
const app = express(); // configura o aplicativo usando express
const port = process.env.PORT || 3000; // define a porta procurando nas variáveis do ambiente ou usando 3000

app.set('view engine', 'ejs'); // configura a view engine para usar ejs  
app.set('views', './views'); // define a pasta das views

app.use(express.json()); // middleware para interpretar json
app.use(express.static('public')); // middleware para configurar uma pasta de arquivos estáticos

app.use(cors()); // middleware para habilitar cors (libera acesso de qualquer domínio)
app.use(logger); // habilita o middleware logger

// configurações do middleware que registra todas as solicitações (mostra o método e o caminho) 
function logger(req, res, next) { 
  console.log(req.method, req.originalUrl); // registra no console toda solicitação
  next(); // função necessária para o próximo middleware rodar
}

const produtos = require('./produtos.json');

app.get('/produtos', (req, res) => {
  // variável que será enviada para o cliente
  let conteudo = '';
  produtos.forEach((produto) => {
    conteudo += criarHtml(produto);
  });
  
  // envia ao cliente o arquivo index.ejs junto do conteúdo da página
  res.render('index', { 
    content: conteudo,
    title: 'Exemplo express js'
   });
});

// rota para encontrar um produto específico
app.get('/produtos/:id', (req, res) => {
  let conteudo = '';

  // garantindo que o id pedido é um dos ids dos produtos
  let parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) {
    conteudo = 'O id não é um número';
  } else {
    // lógica para encontrar o produto com o id procurado
    let requestedProduct = produtos.find((produto) => produto.id === parsedId);
    conteudo = criarHtml(requestedProduct);
  };

  // envia ao cliente o arquivo index.ejs junto do conteúdo da página
  res.render('index', { 
    content: conteudo,
    title: 'Exemplo express js'
  });
});



// faz o server ouvir toda vez que a porta definida na variável "port" seja usada
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

 // função para criar o html para cada produto
function criarHtml(produto) {
  return `
    <div class='produto'>
      <span>${produto.id}</span>
      <span>${produto.nome}</span>
      <span>${produto.valor}R$</span>
      <img src="${produto.imagem}" alt="${produto.nome}">
    </div>
    `
};