const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "926457pP!!",
  database: "marquei",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10
});

async function connectDB() {
  try {
    const connection = await pool.getConnection();
    console.log("Conectado ao MySQL");
    connection.release();
  } catch (err) {
    console.error("Erro ao conectar no banco", err);
    throw err;
  }
}

module.exports = { pool, connectDB };