const express = require('express');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json());

//Routes
app.get("/hello", (req, res) => res.send("Hello"));
app.post("/hello", (req, res) => res.send(`Hello ${req.body.name}`))

app.listen(8000, () => console.log("Listening on Port 8000"))