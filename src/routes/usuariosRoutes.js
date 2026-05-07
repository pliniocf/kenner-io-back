const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/authRoleMiddleware");
const controller = require("../controllers/usuariosController");

router.get("/", controller.getUsuarios);
router.get("/:id", controller.getUsuarioById);
router.post("/", controller.createUsuario);
router.post("/login", controller.loginUsuario)
router.put("/:id", controller.updateUsuario);
router.delete("/:id", controller.deleteUsuario);

module.exports = router;