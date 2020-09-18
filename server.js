const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

require("dotenv").config({ path: "variables.env" });

const Recipe = require("./models/Recipe");
const User = require("./models/User");

//Bring garphQl-express midleware
const { graphiqlExpress, graphqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");

//create schema

const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

//connect to db
// const MongoClient = require("mongodb").MongoClient;
// const uri =
//   "mongodb+srv://AdminArwa:Arwa_1996@cluster0.p8xqk.mongodb.net/dbArwa?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect((err) => {
//   // const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log("DB CONNECTED");
//   client.close();
// });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log(err));
//initialize Application
const app = express();

// to react
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

//set up jwt authentacation middle ware
app.use(async (req, res, next) => {
  const token = req.headers["authorization"];
  if (token !== "null") {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
    } catch (err) {
      console.error(err);
    }
  }
  next();
});

//create graphiql application
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

//connect schema to graphql
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress(({ currentUser }) => ({
    schema,
    context: {
      Recipe,
      User,
      currentUser,
    },
  }))
);

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log("Server listening on PORT ${PORT}");
});
