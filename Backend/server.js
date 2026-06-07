require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
})
);

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


mongoose.connect(process.env.MONGO_URI, {})

































































const express = require('express');


const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Kharche backend running');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
