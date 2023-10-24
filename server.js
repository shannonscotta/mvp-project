import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

// load configs from .env file
dotenv.config();
const { PORT, DATABASE_URL } = process.env;
const app = express();

// serve static files from 'public'
app.use(express.static("public"));

// handle incoming JSON requests
app.use(express.json());

// set up Postgres client with our DB URL
const client = new pg.Client({ connectionString: DATABASE_URL });
await client.connect();

// handle errors centrally
const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Internal Server Error" });
};

// check if user's credentials are valid
const authenticateUser = (req, res, next) => {
  const { email, password } = req.body;

  // find user by email in DB
  client.query("SELECT * FROM users WHERE email = $1", [email])
    .then(result => {
      if (result.rows.length === 0) {
        throw new Error("Invalid email or password");
      }

      const user = result.rows[0];
      // check if the provided password matches the one in the DB
      return bcrypt.compare(password, user.password)
        .then(match => {
          if (!match) throw new Error("Invalid email or password");
          req.user = user;
          next();
        });
    })
    .catch(next);  
};

// handle login route
app.post("/users/signin", authenticateUser, (req, res) => {
  const { password, ...userWithoutPassword } = req.user;
  
  // respond with user details, without the password
  res.json({
    message: "Logged in successfully",
    user: userWithoutPassword,
  });
});

// handle signup route
app.post("/users/signup", (req, res, next) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;

  // hash and store the user's password
  bcrypt.hash(password, saltRounds)
    .then(hashedPassword => {
      return client.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, hashedPassword]
      );
    })
    .then(result => {
      if (result.rows && result.rows[0]) {
        res.json({
          message: "User signed up successfully",
          user: result.rows[0],
        });
      } else {
        throw new Error("User registration failed");
      }
    })
    .catch(next);
});

// use error handler for all subsequent middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});