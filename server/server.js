const express = require("express");

const app = express();
const port = 3001;

app.use(require("cors")());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// integrate router and database abstraction
app.use(require("./src/router"));
const { createConnection } = require("./src/database");

createConnection()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is listening on port: ${port}`);
        });
    })
    .catch(console.log) 



