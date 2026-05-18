const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Project Web Bersama - Backend");
});

const PORT = process.env.PORT || 5173;

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});