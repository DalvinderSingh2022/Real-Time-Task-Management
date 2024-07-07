const express = require("express");

const app = express();

app.use(express.json());

app.listen(4000, () => {
    console.log(`listening to port: ${4000}`)
});