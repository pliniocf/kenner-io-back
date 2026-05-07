const prisma = require("../prisma/prismaClient");

// Coleta a disponibilidade dos profissionais para realizar os serviços
exports.getDisponibilidade = async (req, res) => {
  try {
    const profissionalId = Number(req.query.profissionalId);
    const data = req.query.data;

    if (!profissionalId || !data) {
      return res.status(400).json({ message: "Parâmetros inválidos" });
    }

    const profissional = await prisma.usuarios.findUnique({
      where: { id: profissionalId }
    });

    if (!profissional) {
      return res.status(404).json({ message: "Profissional não encontrado" });
    }

    // Horário do profissional (banco salva com ano, então tem que adaptar)
    const horaEntrada = new Date(profissional.hora_entrada);
    const horaSaida = new Date(profissional.hora_saida);

    // Horários que já estão agendados no dia
    const horariosOcupados = await prisma.agendamentos.findMany({
      where: {
        profissional_id: profissionalId,
        data_hora: {
          gte: new Date(`${data}T00:00:00`),
          lte: new Date(`${data}T23:59:59`)
        }
      }
    });

    // Gera slots de 30 em 30 mins
    const horariosGerados = [];
    const dataAtual = new Date(horaEntrada);

    // Aqui só gera os horários disponíveis do funcionário, então
    // a data não importa, apenas o horário
    while (dataAtual < horaSaida) {
      const hora = String(dataAtual.getHours()).padStart(2, '0');
      const minuto = String(dataAtual.getMinutes()).padStart(2, '0');

      horariosGerados.push(`${hora}:${minuto}`);
      dataAtual.setMinutes(dataAtual.getMinutes() + 30);
    }

    const ocupados = horariosOcupados.map((agendamento) => {
      const dataHora = new Date(agendamento.data_hora);
      const hora = String(dataHora.getHours()).padStart(2, '0');
      const minuto = String(dataHora.getMinutes()).padStart(2, '0');
      return `${hora}:${minuto}`;
    });

    // Remove os horários ocupados
    const horariosDisponiveis = horariosGerados.filter((horario) =>
      !ocupados.includes(horario)
    );

    res.json(horariosDisponiveis);

  } catch (err) {
    res.status(500).json({
      message: "Erro interno",
      error: err.message
    });
  }
};


exports.createAgendamento = async (req, res) => {
  try {
    const {
      cliente_id: cliente_id_body,
      servico_id: servico_id_body,
      profissional_id: profissional_id_body,
      data,
      horario
    } = req.body;

    const cliente_id = Number(cliente_id_body);
    const servico_id = Number(servico_id_body);
    const profissional_id = Number(profissional_id_body);

    // Validação de campos
    if (!cliente_id || !servico_id || !profissional_id || !data || !horario) {
      return res.status(400).json({
        message: "Campos obrigatórios não preenchidos"
      });
    }

    // Cria a hora de acordo com o enviado pelo usuário
    const dataHora = new Date(`${data}T${horario}:00`);

    const servico = await prisma.servicos.findUnique({
      where: { id: servico_id }
    });

    if (!servico) {
      return res.status(404).json({
        message: "Serviço não encontrado"
      });
    }

    const profissional =
      await prisma.usuarios.findUnique({
        where: { id: profissional_id }
      });

    if (!profissional) {
      return res.status(404).json({
        message: "Profissional não encontrado"
      });
    }

    // Verifica se o profissional realiza o serviço solicitado
    const relacao =
      await prisma.profissionais_servicos.findFirst({
        where: { profissional_id, servico_id }
      });

    if (!relacao) {
      return res.status(400).json({
        message: "Profissional não realiza esse serviço"
      });
    }

    // Verifica conflito de horário na hora do agendamento
    const conflito =
      await prisma.agendamentos.findFirst({
        where: { profissional_id, data_hora: dataHora }
      });

    if (conflito) {
      return res.status(400).json({
        message: "Horário indisponível"
      });
    }

    // Cria o agendamento no banco
    const agendamento =
      await prisma.agendamentos.create({
        data: {
          cliente_id,
          servico_id,
          profissional_id,
          data_hora: dataHora,
          ja_realizado: false
        }
      });

    return res.status(201).json({
      message: "Agendamento criado",
      agendamento
    });

  } catch (err) {
    return res.status(500).json({
      message: "Erro interno",
      error: err.message
    });

  }
};
