const express = require('express');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');
const path = require('path');

app.listen('3000', () => {
    console.log('Server is running on port 3000');
});

//body parser
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); //views é o nome da pasta
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//init mysql
const db = mysql.createConnection({
    host: 'localhost',  //localhost
    user: 'root',     //root
    password: '',   //senha
    database: 'users'  //nome do banco
});

db.connect((err) => {
    if(err) console.log('Error connecting to database');
    else console.log('Database connected');
})

app.get('/', (req, res) => {
        res.render('index', {nome: null, email: null})
})

app.get('/cadastro', (req, res) => {
    res.render('cadastro', {});
})

app.get('/login', (req, res) => {
    res.render('login', {});
})

var id = 1
app.post('/cadastro', (req, res) => {
    let nome = req.body.nome;
    let email = req.body.email;
    let senha = req.body.senha;
    let sql = 'INSERT INTO usuarios (id, nome, email) VALUES (?,?,?)';
    db.query(sql,[id, nome, email], (err, result) => {})
         bcrypt.hash(senha, 10, (err, hash) => {
             let sql = 'UPDATE usuarios SET senha = ? WHERE id = ?';
             db.query(sql, [hash, id], (err, result) => {})
             id++;
            })
    res.render('index', {nome: nome, email: email});
})

app.post('/login', (req, res) => {
    let email = req.body.email;
    let senha = req.body.senha;
    let sql = 'SELECT * FROM `usuarios` WHERE `email` = ?';
    db.query(sql, [email], (err, result) => {
        let nome = result[0].nome;
        if(result.length > 0) {
            bcrypt.compare(senha, result[0].senha, (err, result) => {
                if(result) {
                    res.render('index', {nome: nome, email: email});
                } else {
                    res.redirect('login');
                    console.log('Senha incorreta');
                }
            })
        } else {
            res.redirect('login');
            console.log('Usuário não encontrado');
        }
    })
})