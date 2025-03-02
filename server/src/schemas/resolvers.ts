// server/src/schemas/resolvers.ts
import { AuthenticationError } from 'apollo-server-express';
import { User } from '../models';
import { signToken } from '../services/auth';
import type { MyContext } from '../services/auth';

interface BookInput {
  bookId: string;
  authors: string[];
  description: string;
  title: string;
  image?: string;
  link?: string;
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: MyContext) => {
      // Check if user is authenticated via context
      if (context.user) {
        // If authenticated, find and return user data
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password');
        
        return userData;
      }
      
      // If not authenticated, throw an error
      throw new AuthenticationError('Not authenticated');
    },
  },
  Mutation: {
    login: async (_parent: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.validatePassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    addUser: async (_parent: any, args: { username: string; email: string; password: string }) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (_parent: any, { bookData }: { bookData: BookInput }, context: MyContext) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (_parent: any, { bookId }: { bookId: string }, context: MyContext) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

export default resolvers;