const express = require("express");
const router = express.Router();

const controller = require("../controllers/agendamentosController");

router.get("/disponibilidade", controller.getDisponibilidade);
router.post("/", controller.createAgendamento);

module.exports = router;