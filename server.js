import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

//console.log('process.env', process.env.PORT);

const app = express();

//console.log(process.env.DATABASE_URL, "url");

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

try {
  await client.connect();
} catch (err) {
  console.error(err);
}

app.use(express.static("public"));

app.get("/api/students", (req, res, next) => {
  client
    .query(`SELECT * FROM student`)
    .then((data) => {
      res.json(data);
    })
    .catch(next);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

app.listen(process.env.PORT, () => {
  console.log(`listening on Port ${process.env.PORT}`);
});
