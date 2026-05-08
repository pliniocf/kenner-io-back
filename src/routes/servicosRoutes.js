const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authRoleMiddleware");
const controller = require("../controllers/servicosController");

router.get("/", controller.getServicos);
router.get("/:id/profissionais", controller.getProfissionaisPorServico);
router.post("/", authMiddleware, authorizeRoles("gerente"), controller.createServico);

module.exports = router;