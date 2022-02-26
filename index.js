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
    let sql = 'SELECT * FROM `usuarios` ';
    let query = db.query(sql, (err, results) => {
        res.render('index', {user: results})
    })
})

app.get('/cadastro', (req, res) => {
    res.render('cadastro', {});
})

app.post('/cadastro', (req, res) => {
    let nome = req.body.nome;
    let email = req.body.email;
    let senha = req.body.senha;
    bcrypt.hash(senha, 10, (err, hash) => {
        db.query('INSERT INTO `usuarios`(`senha`) VALUES (?)', [hash], (err, result) => {})
    })
    let sql = 'INSERT INTO `usuarios`(`nome`, `email`) VALUES (?,?)'
    db.query(sql,[nome, email], (err, result) => {})
})
