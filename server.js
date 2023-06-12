import express from "express";

const PORT = process.env.PORT || 8080;
const app = express();

app.get('/', (req, res) => {
    res.send("Api's are up and running");
});

app.listen(PORT, () => {
    console.log("server is up and listening")
});