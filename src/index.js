const express = require("express");
const cors = require("cors");
const { connectDB } = require('./db');

const app = express();
const PORT = 3000;

const fs = require("fs");
const path = require("path");

app.use(cors());

// ✅ primeiro middlewares
app.use(express.json());

// 🔥 depois rotas dinâmicas
const routesPath = path.join(__dirname, "routes");

fs.readdirSync(routesPath).forEach((file) => {
  const route = require(`./routes/${file}`);
  const routeName = file.replace('Routes.js', '');

  app.use(`/${routeName}`, route);
});

// rota teste
app.get("/", (req, res) => {
  res.send("API de pé");
});

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Servidor em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Falha ao iniciar a API');
  }
}

startServer();