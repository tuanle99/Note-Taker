const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");

const app = express();
const PORT = 3000;

const database = "./db/db.json";
let rawdata = fs.readFileSync(database);
let data = JSON.parse(rawdata);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.get("/api/notes", (req, res) => res.json(data));

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uniqid();
  data.push(newNote);
  fs.writeFileSync(database, JSON.stringify(data));
  res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const note = data.findIndex((p) => p.id == id);
  data.splice(note, 1);
  fs.writeFileSync(database, JSON.stringify(data));
  res.send();
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
