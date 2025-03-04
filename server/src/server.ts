// server/src/server.ts
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import path from 'path';
import db from './config/connection';
import { typeDefs, resolvers } from './schemas';
import { authMiddleware } from './services/auth';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3001;

  // Initialize Apollo Server with context
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  await server.start();
  
  // Apply Express middleware
  // @ts-ignore
  server.applyMiddleware({ app });

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Serve static assets
  // Look for client files in the dist/client directory where we copied them
  app.use(express.static(path.join(__dirname, 'client')));

  // Wildcard route to serve the React app
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
  });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startServer();