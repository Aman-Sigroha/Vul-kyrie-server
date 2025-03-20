const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  user: "your_username",
  host: "your_db_host",
  database: "your_db_name",
  password: "your_password",
  port: 5432,
});

app.get('/', (req, res) => {
res.send('VULKAIRE');
});

app.post("/data", async (req, res) => {
  const { diclofenac, ketoprofen } = req.body;
  await pool.query("INSERT INTO test_results (diclofenac, ketoprofen) VALUES ($1, $2)", [diclofenac, ketoprofen]);
  res.send({ status: "success" });
});

app.listen(3000, () => console.log("Server running on port 3000"));