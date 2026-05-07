const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// GET
exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET por ID
exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { id: Number(req.params.id) }
    });

    res.json(usuario);
  } catch (err) {
    res.status(500).json(err);
  }
};

// POST
exports.createUsuario = async (req, res) => {
  try {
    const { nome, email, senha, cpf, telefone, perfil = "cliente", hora_entrada, hora_saida } = req.body;

    if (!nome || !email || !senha || !telefone) {
      return res.status(400).json({ message: "Campos obrigatórios não preenchidos" });
    }

    const hash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuarios.create({
      data: {
        nome,
        email,
        senha: hash,
        cpf,
        telefone,
        perfil,
        hora_entrada,
        hora_saida
      }
    });

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    });

  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ message: "CPF ou email já cadastrados." });
    }

    return res.status(500).json({
      message: "Erro interno",
      error: err.message
    });
  }
};

// LOGIN
exports.loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        message: "É necessário preencher os campos de login e senha"
      });
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({ message: "Senha inválida" });
    }

    //Gera o token do JWT para o usuário
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        perfil: usuario.perfil
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    const { senha: senhaBanco, ...usuarioSemSenha } = usuario;

    return res.status(200).json({
      message: "Login efetuado",
      usuario: usuarioSemSenha,
      token
    });

  } catch (err) {
    res.status(500).json(err);
  }
};

// PUT
exports.updateUsuario = async (req, res) => {
  try {
    const { nome, perfil, senha, telefone, cpf } = req.body;

    let data = { nome, perfil, telefone, cpf };

    // se vier senha, atualiza com hash
    if (senha) {
      data.senha = await bcrypt.hash(senha, 10);
    }

    await prisma.usuarios.update({
      where: { id: Number(req.params.id) },
      data
    });

    res.json({ mensagem: "Atualizado com sucesso" });

  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE
exports.deleteUsuario = async (req, res) => {
  try {
    await prisma.usuarios.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ mensagem: "Deletado com sucesso" });

  } catch (err) {
    res.status(500).json(err);
  }
};