const express = require("express");
const router = express.Router();

const controller = require("../controllers/agendamentosController");

router.get("/disponibilidade", controller.getDisponibilidade);
router.post("/", controller.createAgendamento);
/*router.get("/:id", controller.getUsuarioById);
router.put("/:id", controller.updateUsuario);
router.delete("/:id", controller.deleteUsuario); */

module.exports = router;