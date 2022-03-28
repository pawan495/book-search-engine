const express = require("express");
const path = require("path");
const db = require("./config/connection");

// apollo and related imports
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");

// express setup
const app = express();
const PORT = process.env.PORT || 3001;

// apollo setup
const startServer = async () => {
   // create a new Apollo server and pass in our schema data
   const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: authMiddleware,
   });

   // Start Apollo server
   await server.start();

   // integrate our Apollo server with the Express application as middleware
   server.applyMiddleware({ app });

   // provide link to graphql sandbox
   console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

// apollo start
startServer();

// express start
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
   app.use(express.static(path.join(__dirname, "../client/build")));
}

// home page
app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
   app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
   });
});
