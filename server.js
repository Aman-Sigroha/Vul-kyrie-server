require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432, 
  ssl: { rejectUnauthorized: false }
});

app.get("/", (req, res) => {
  res.send("VULKAIRE");
});

app.get("/api/device", async (req, res) => {
  try {
    const query = "SELECT * FROM reports ORDER BY Timestamp DESC;";
    const result = await pool.query(query);
    
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/device", async (req, res) => {
  const { Sample_ID, Device_ID, Latitude, Longitude, Timestamp, Result, Danger } = req.body;

  if (!Sample_ID || !Device_ID || !Latitude || !Longitude || !Danger) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const query = `
      INSERT INTO reports (Sample_ID, Device_ID, Latitude, Longitude, Timestamp, Result, Danger) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const values = [Sample_ID, Device_ID, Latitude, Longitude, Timestamp || new Date(), Result, Danger];

    const result = await pool.query(query, values);
    res.status(201).json({ message: "Data inserted successfully", data: result.rows[0] });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: error });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
