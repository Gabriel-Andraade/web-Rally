const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../form'))); //formulario que ao preencher te encaminha com os dados para o main_pg.html
app.use(express.static(path.join(__dirname, '../logged'))); //caso já possuir cadastro e logar, te encaminha para o logged.html
app.use(express.static(path.join(__dirname, '../main_pg'))); //página principal do projetinho
app.use(express.static(path.join(__dirname, '../main_pg/content'))); //esse content é um conteudo html separado quando acessa o main_pg.html
app.use(express.static(path.join(__dirname, '../photo_main'))); //arquivo de imagem que é chamado no main_pg.html

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form', 'form.html'));
});

app.post('/users/register', (req, res) => {
    const userData = req.body;

    const filePath = path.join(__dirname, 'users.json');
    let users = [];

    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        users = JSON.parse(data);
    }

    const userExists = users.some(user => user.email === userData.email);
    if (userExists) {
        return res.status(400).send({ message: 'Usuário já cadastrado!' });
    }

    users.push(userData);

    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
    res.status(201).send({ message: 'Usuário registrado com sucesso!' });
});

app.get('/users', (req, res) => {
    const filePath = path.join(__dirname, 'users.json');
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        const users = JSON.parse(data);
        res.json(users);
    } else {
        res.status(404).send({ message: 'Nenhum usuário encontrado.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});