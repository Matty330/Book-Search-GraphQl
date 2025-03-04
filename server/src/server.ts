// server/src/server.ts
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
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

  // Add a health check route
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'API is working!' });
  });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startServer();