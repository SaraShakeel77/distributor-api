const express = require("express");
const app = express();


const healthRoutes = require("./routes/health.routes");
const requestLogger = require("./middleware/requestLogger");
const notfound = require("./middleware/notfound");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use(requestLogger);
app.use(healthRoutes);
app.use(notfound);
app.use(errorHandler);
module.exports= app;