DROP TABLE IF EXISTS student;

CREATE TABLE student(
   id SERIAL PRIMARY KEY NOT NULL,
   name TEXT NOT NULL,
   num_cats INT NOT NULL,
   place TEXT
);