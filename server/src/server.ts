import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schemas';
import path from 'path';
import jwt from 'jsonwebtoken';
import User from './models/User';
import mongoose from 'mongoose';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks')
  .then(() => {
    console.log('MongoDB connected!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const app: Application = express();
app.use(express.json());

// Optional auth middleware for Apollo context
const authMiddleware = async (req: any) => {
  const token = req.headers.authorization || '';
  if (!token) return {};

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY || 'fallback_secret');
    const user = await User.findById(decoded._id);
    return { user };
  } catch (err) {
    return {};
  }
};

(async () => {
  // Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // Provide user context if available
      return await authMiddleware(req);
    },
  });

  // Start Apollo
  await server.start();
  server.applyMiddleware({ app: app as any }); // Cast to 'any' to avoid type mismatch

  // Serve static assets if in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  // Start listening on port 3001
  app.listen(3001, () => {
    console.log(`🚀 Server running at http://localhost:3001${server.graphqlPath}`);
  });
})();
