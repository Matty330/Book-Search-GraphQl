import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schemas';
import path from 'path';
import jwt from 'jsonwebtoken';
import User from './models/User';

const app: Application = express();
app.use(express.json());

/**
 * NOTE:
 * We solve the mismatch by adding \"as any\" to the applyMiddleware app property.
 * This is necessary due to conflicting @types/express versions inside Apollo
 * and your main project’s node_modules.
 */
const authMiddleware = async (req: any) => {
  const token = req.headers.authorization || '';
  if (!token) return {};

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findById(decoded._id);
    return { user };
  } catch (err) {
    return {};
  }
};

(async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => authMiddleware(req),
  });

  await server.start();
  // Casting 'app' to 'any' bypasses the mismatch type
  server.applyMiddleware({ app: app as any });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.listen(3001, () => {
    console.log(`🚀 Server running at http://localhost:3001${server.graphqlPath}`);
  });
})();
