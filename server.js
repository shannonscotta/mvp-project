import express from "express";
import pg from "pg";
import dotenv from "dotenv";

// Load enviroment variables from the .env file.
dotenv.config();

// Destructure out the enviroment variables we're interested in.
const { PORT, DATABASE_URL } = process.env;

const client = new pg.Client({
  connectionString: DATABASE_URL,
});

await client.connect();

const app = express();

// Host all files in the "public" directory at the root URL.
app.use(express.static("public"));

// Handle parsing incoming requests with JSON bodies.
app.use(express.json());

app.get("/things", (req, res) => {
  client.query("SELECT * FROM thing").then((result) => {
    res.json(result.rows);
  });
});

app.post("/things", (req, res) => {
  const { num } = req.body;

  client
    .query("INSERT INTO thing (num) VALUES ($1) RETURNING *", [num])
    .then((result) => {
      res.json(result.rows[0]);
    });
});

app.delete("/things/:id", (req, res) => {
  const { id } = req.params;

  client.query("DELETE FROM thing WHERE id = $1", [id]).then(() => {
    res.sendStatus(204);
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});