const prisma = require('../prisma/prismaClient');

// GET
exports.getServicos = async (req, res) => {
  try {
    const servicos = await prisma.servicos.findMany();

    res.json(servicos);
  } catch (err) {
    res.status(500).json(err);
  }
};

// POST
exports.createServico = async (req, res) => {
  try {
    const { nome, tempo, valor } = req.body;

    if (!nome || !tempo || !valor) {
      return res.status(400).json({
        message: "Campos obrigatórios não preenchidos"
      });
    }

    const servico = await prisma.servicos.create({
      data: {
        nome,
        tempo,
        valor
      }
    });

    res.status(201).json(servico);

  } catch (err) {
    res.status(500).json({
      message: "Erro interno",
      error: err.message
    });
  }
};