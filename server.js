const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));


const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "fantasy_cats"
});

conexao.connect(function(erro) {
    if (erro) {
        console.log("Erro ao conectar ao banco:", erro);
        return;
    }

    console.log("Banco de dados conectado!");
});


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});


app.post("/cadastrar", async function(req, res) {

    const {
        nome,
        telefone,
        email,
        cidade,
        estado,
        endereco,
        senha
    } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            mensagem: "Preencha nome, e-mail e senha."
        });
    }

    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        const sql = `
            INSERT INTO cliente
            (nome, telefone, email, cidade, estado, endereco, data_cadastro, senha_hash)
            VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?)
        `;

        conexao.query(
            sql,
            [
                nome,
                telefone || null,
                email,
                cidade || null,
                estado || null,
                endereco || null,
                senhaHash
            ],
            function(erro, resultado) {

                if (erro) {
                    console.log("Erro no cadastro:", erro);

                    if (erro.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            mensagem: "Este e-mail já está cadastrado."
                        });
                    }

                    return res.status(500).json({
                        mensagem: "Erro ao realizar cadastro."
                    });
                }

                res.status(201).json({
                    mensagem: "Cadastro realizado com sucesso!",
                    id_cliente: resultado.insertId
                });
            }
        );

    } catch (erro) {
        console.log(erro);

        res.status(500).json({
            mensagem: "Erro ao proteger a senha."
        });
    }
});


app.post("/login", function(req, res) {

    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            mensagem: "Informe o e-mail e a senha."
        });
    }

    const sql = "SELECT * FROM cliente WHERE email = ?";

    conexao.query(sql, [email], async function(erro, resultados) {

        if (erro) {
            console.log("Erro no login:", erro);

            return res.status(500).json({
                mensagem: "Erro ao consultar o banco de dados."
            });
        }

        if (resultados.length === 0) {
            return res.status(401).json({
                mensagem: "E-mail ou senha incorretos."
            });
        }

        const cliente = resultados[0];

        if (!cliente.senha_hash) {
            return res.status(401).json({
                mensagem: "Esta conta ainda não possui uma senha cadastrada."
            });
        }

        try {
            const senhaCorreta = await bcrypt.compare(
                senha,
                cliente.senha_hash
            );

            if (!senhaCorreta) {
                return res.status(401).json({
                    mensagem: "E-mail ou senha incorretos."
                });
            }

            res.json({
                mensagem: "Login realizado com sucesso!",
                id_cliente: cliente.id_cliente,
                nome: cliente.nome
            });

        } catch (erro) {
            console.log(erro);

            res.status(500).json({
                mensagem: "Erro ao verificar a senha."
            });
        }
    });
});


app.listen(3000, function() {
    console.log("Fantasy Cats funcionando em http://localhost:3000");
});