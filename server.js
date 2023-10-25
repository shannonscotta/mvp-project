import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const { PORT, DATABASE_URL } = process.env;
const app = express();

// serve static files from 'public'
app.use(express.static("public"));

// enable middleware for receiving JSON request body
app.use(express.json());

// set up Postgres client with DB URL
const client = new pg.Client({ connectionString: DATABASE_URL });

client.connect().catch(console.error);

// check if users creds are valid
const authenticateUser = (req, res, next) => {
  const { email, password } = req.body;

  // find user by email in DB
  client
    .query("SELECT * FROM users WHERE email = $1", [email])
    .then((result) => {
      if (result.rows.length === 0) {
        throw new Error("Invalid email or password.");
      }

      let user = result.rows[0];

      // check if the entered password matches the DB
      return bcrypt.compare(password, user.password)
      .then((match) => {
        if (!match) throw new Error("Invalid email or password.");
        req.user = user;
        next();
      });
    })
    .catch(next);
};

// handle login
app.post("/users/signin", authenticateUser, (req, res) => {
  res.json({ message: "Logged in successfully", user: req.user });
});

// handle signup
app.post("/users/signup", (req, res, next) => {
  let { name, email, password } = req.body;

  // saltRounds? indicates how many iterations of algorithms, 10 salt is 2^10 aka 1024 iterations
  let saltRounds = 10;

  //bcrypt? cryptographic salted password hashing function designed to defend against rainbow table and brute-force search attacks.
  //hashSync? securely converts a plain text password into a hashed version using salt.
  let hashedPassword = bcrypt.hashSync(password, saltRounds);

  client.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    )
    .then(result => {
      res.json({ message: "Successful registration", user: result.rows[0] });
    })
    .catch(next);
});



// middleware catch all
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
  res.json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
