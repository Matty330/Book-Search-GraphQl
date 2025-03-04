// server/src/server.ts
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import path from 'path';
import fs from 'fs';
import db from './config/connection';
import { typeDefs, resolvers } from './schemas';
import { authMiddleware } from './services/auth';

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
  // @ts-ignore - Type mismatch in apollo-server-express types
  server.applyMiddleware({ app });

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Debug info for file paths
  console.log('Current directory:', process.cwd());
  console.log('__dirname:', __dirname);

  // Serve static assets if in production
  if (process.env.NODE_ENV === 'production') {
    // Try different paths that might work in the Render environment
    const clientPath = path.join(process.cwd(), 'client/build');
    const altClientPath = path.join(process.cwd(), '../client/build');
    
    console.log('Checking client path:', clientPath);
    console.log('Checking alt client path:', altClientPath);
    
    // Check if these paths exist
    console.log('Client path exists:', fs.existsSync(clientPath));
    console.log('Alt client path exists:', fs.existsSync(altClientPath));
    
    // Use the path that exists
    const buildPath = fs.existsSync(clientPath) ? clientPath : altClientPath;
    
    app.use(express.static(buildPath));
    
    app.get('*', (_req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startServer();