# .env
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb+srv://mikagro:E8FoUje2thTpnoYL@cluster0.o44icis.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
TEST_MONGO_URI=mongodb+srv://mikagro:HHWuf1LQK9pqiOKI@cluster0.5y754xx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
SECRET=S4lain3nAv4in


# Install Dependencies
npm install express dotenv cors mongoose jsonwebtoken bcrypt colors validator
npm install nodemon concurrently jest supertest  cross-env -D

# Run Backend
npm run dev

# Running tests
npm test

# App.js
```
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const customMiddleware = require("./middleware/customMiddleware");
const petRouter = require("./routers/petRouter");
const userRouter = require("./routers/userRouter");

// express app
const app = express();

connectDB();

// middleware
app.use(cors());
app.use(express.json());

app.use(customMiddleware.requestLogger);

app.get("/", (req, res) => res.send("API Running!"));

app.use("/api/pets", petRouter);
app.use("/api/users", userRouter);

app.use(customMiddleware.unknownEndpoint);
app.use(customMiddleware.errorHandler);

module.exports = app;
```


# server.js

```
const app = require('./app');
const http = require('http');
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server is running on http://localhost:${config.PORT}`)
});
```


# Middleware

const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
};
  
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};
  
const errorHandler = (error, request, response, next) => {
    console.error(error.message);
  
    response.status(500);
    response.json({
      message: error.message,
    });
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
};

# requireAuth.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
     // verify user is authenticated
     const { authorization } = req.headers;
   
     if (!authorization) {
       return res.status(401).json({ error: "Authorization token required" });
     }
   
     const token = authorization.split(" ")[1];
   
     try {
       const { _id } = jwt.verify(token, process.env.SECRET);
   
       req.user = await User.findOne({ _id }).select("_id");
       next();
     } catch (error) {
       console.log(error);
       res.status(401).json({ error: "Request is not authorized" });
     }
};
   
module.exports = requireAuth;


# 