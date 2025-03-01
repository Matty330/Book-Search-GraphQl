import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schemas'; // Ensure this points to your schema definitions
import resolvers from './schemas'; // Ensure this points to your resolvers
import path from 'path';
import jwt from 'jsonwebtoken';
import { User } from './models/User'; // Assuming you have a User model for Mongoose

const app = express();

// Middleware to check if the user is authenticated
const authMiddleware = async (req: any) => {
  const token = req.headers.authorization || ''; // Look for the token in the Authorization header
  if (!token) {
    throw new Error('You must be logged in');
  }

  try {
    // Verify the token and extract the user data
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findById(decoded._id); // Get the user by decoded ID
    return { user }; // Attach the user to the request context
  } catch (err) {
    throw new Error('Not authenticated');
  }
};

// Apollo Server setup with auth middleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => authMiddleware(req), // Attach user to the context
});

// Apply Apollo Server middleware to Express
server.applyMiddleware({ app });

// Serve static files from the client build folder
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Start the server
app.listen({ port: 3001 }, () =>
  console.log(`Server running at http://localhost:3001${server.graphqlPath}`)
);
