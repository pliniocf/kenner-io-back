const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

const fs = require("fs");
const path = require("path");

const prisma = require("./prisma/prismaClient");

app.use(cors());
app.use(express.json());

//rotas dinâmicas
const routesPath = path.join(__dirname, "routes");

fs.readdirSync(routesPath).forEach((file) => {
  const route = require(`./routes/${file}`);
  const routeName = file.replace('Routes.js', '');

  app.use(`/${routeName}`, route);
});

// rota teste
app.get("/", (req, res) => {
  res.send('API de pé');
});

// iniciar servidor
async function startServer() {
  try {
    // 🔥 testa conexão com banco
    await prisma.$connect();
    console.log("Conectado ao banco");

    app.listen(PORT, () => {
      console.log(`Servidor em http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Erro ao iniciar API:', err);
  }
}

startServer();