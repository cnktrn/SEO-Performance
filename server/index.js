import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import usersRouter from "./routes/users.js";
import dashboardsRouter from "./routes/dashboards.js";
import kpisRouter from "./routes/kpis.js";
import querisRouter from "./routes/queries.js";

const app = express();

// define the port to run on
const PORT = 5555;

// use bodyParser & define default parameter
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors());

app.use("/users", usersRouter)
app.use("/dashboards", dashboardsRouter)
app.use("/kpis", kpisRouter)
app.use("/queries", querisRouter)

// connect to mongodb using a connection string
const CONNECTION_URL = "mongodb+srv://max:max123@di.6jqtvsa.mongodb.net/seodashboard?retryWrites=true&w=majority";
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server is running");
        })
    })
    .catch((error) => console.log(error.message));

mongoose.set("returnOriginal", false);
mongoose.set("strictQuery", true);