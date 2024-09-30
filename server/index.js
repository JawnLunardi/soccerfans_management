const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "1234",
  database: "soccerteam",
});

// Endpoint para adicionar um novo fã
app.post("/create", (req, res) => {
  const name = req.body.name;
  const birth = req.body.birth;
  const team = req.body.team;

  db.query(
    "INSERT INTO fans (name, birth, team) VALUES (?,?,?)",
    [name, birth, team],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Fan added successfully!");
      }
    }
  );
});

// Endpoint para buscar todos os fãs
app.get("/fans", (req, res) => {
  db.query("SELECT * FROM fans", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// Endpoint para atualizar as informações de um fã
app.put("/update", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const birth = req.body.birth;
  const team = req.body.team;

  db.query(
    "UPDATE fans SET name = ?, birth = ?, team = ? WHERE id = ?",
    [name, birth, team, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// Endpoint para deletar um fã
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM fans WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
