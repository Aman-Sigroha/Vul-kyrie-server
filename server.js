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

app.post("/api/device", async (req, res) => {
  const { Sample_ID, Device_ID, Latitude, Longitude, Timestamp, Result, Danger } = req.body;

 
  if (!Sample_ID || !Device_ID || !Latitude || !Longitude || !Danger) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const query = `
      INSERT INTO device (Sample_ID, Device_ID, Latitude, Longitude, Timestamp, Result, Danger) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const values = [Sample_ID, Device_ID, Latitude, Longitude, Timestamp || new Date(), Result, Danger];

    const result = await pool.query(query, values);
    res.status(201).json({ message: "Data inserted successfully", data: result.rows[0] });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(8000, () => console.log("Server running on port 3000"));