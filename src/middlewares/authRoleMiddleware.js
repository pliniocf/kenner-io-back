const jwt = require("jsonwebtoken");

function authorizeRoles(...rolesPermitidos) {
  return (req, res, next) => {
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    if (!rolesPermitidos.includes(usuario.perfil)) {
      return res.status(403).json({
        message: "Acesso negado: sem permissão"
      });
    }

    next();
  };
}

module.exports = authorizeRoles;