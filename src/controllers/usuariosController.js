const { pool } = require("../db");
const bcrypt = require("bcrypt");

// GET
exports.getUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET por ID
exports.getUsuarioById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE id = ?",
      [req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};

// POST
exports.createUsuario = async (req, res) => {
  try {
    const { nome, email, senha, cpf, telefone, perfil = 'cliente' } = req.body;

    if (!nome || !email || !senha || !telefone) {
      res.status(400).json({ message: "Campos obrigatórios não preenchidos" })
      return;
    }

    const hash = await bcrypt.hash(senha, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios (nome, email, senha, cpf, telefone, perfil) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, email, hash, cpf, telefone, perfil]
    );

    res.json({ id: result.insertId, nome, email });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha)
      res.status(400).json({ message: 'É necessário preencher os campos de login e senha' })

    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    )

    const { senha: senhaBanco, ...usuarioSemSenha} = rows[0];

    const senhaValida = await bcrypt.compare(senha, senhaBanco);

    if (senhaValida) {
      res.status(200).json({
        message: 'Login efetuado',
        usuario: usuarioSemSenha
      })
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

// PUT
exports.updateUsuario = async (req, res) => {
  try {
    const { nome, perfil, senha, telefone, cpf } = req.body;

    await pool.query(
      "UPDATE usuarios SET nome=?, perfil=?, senha=?, telefone=?, cpf=? WHERE id=?",
      [nome, perfil, senha, telefone, cpf, req.params.id]
    );

    res.json({ mensagem: "Atualizado com sucesso" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE
exports.deleteUsuario = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM usuarios WHERE id=?",
      [req.params.id]
    );

    res.json({ mensagem: "Deletado com sucesso" });
  } catch (err) {
    res.status(500).json(err);
  }
};