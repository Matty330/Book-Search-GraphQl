// server/src/server.ts
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import path from 'path';
import fs from 'fs';
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
  server.applyMiddleware({ app });

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Print the current directory for debugging
  console.log('Current working directory:', process.cwd());
  console.log('__dirname:', __dirname);

  // Try multiple possible locations for client files
  const possibleClientPaths = [
    path.join(__dirname, '../../client/build'),
    path.join(__dirname, '../client/build'),
    path.join(process.cwd(), 'client/build'),
    path.join(process.cwd(), '../client/build')
  ];

  // Try each path until we find one that exists
  let clientPath = null;
  for (const testPath of possibleClientPaths) {
    try {
      console.log('Checking path:', testPath);
      const exists = fs.existsSync(testPath);
      console.log('Path exists:', exists);
      if (exists) {
        clientPath = testPath;
        console.log('Found client files at:', clientPath);
        break;
      }
    } catch (err) {
      console.error('Error checking path:', testPath, err);
      // Continue to next path
    }
  }

  // If we found a valid client path, serve those files
  if (clientPath) {
    console.log('Serving static files from:', clientPath);
    app.use(express.static(clientPath));
    
    // This must be defined after the static middleware
    app.get('*', (_req, res) => {
      console.log('Sending index.html from:', path.join(clientPath, 'index.html'));
      res.sendFile(path.join(clientPath, 'index.html'));
    });
  } else {
    console.log('No client build found, serving API only');
    // Serve a basic HTML page that links to the GraphQL playground
    app.get('/', (_req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Book Search API</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
              h1 { color: #333; }
              .link { color: #0066cc; }
            </style>
          </head>
          <body>
            <h1>Book Search API</h1>
            <p>The GraphQL API is running at <a class="link" href="/graphql">/graphql</a></p>
            <p>Client build not found. Please check your deployment configuration.</p>
            <p>Searched paths:</p>
            <ul>
              ${possibleClientPaths.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </body>
        </html>
      `);
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`Server environment: ${process.env.NODE_ENV}`);
    });
  });
}

startServer();