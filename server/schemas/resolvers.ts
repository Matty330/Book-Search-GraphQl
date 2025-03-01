import { User } from "../models/User"; // Assuming you have a User model for Mongoose
import { Book } from "../models/Book"; // Assuming you have a Book model for Mongoose

const resolvers = {
  Query: {
    // Get the current logged-in user's info
    me: async (parent: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      return await User.findById(context.user._id).populate("savedBooks");
    },
  },

  Mutation: {
    // Login a user
    login: async (parent: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user || !user.validatePassword(password)) {
        throw new Error("Invalid credentials");
      }
      return { token: user.generateAuthToken(), user };
    },

    // Add a new user
    addUser: async (parent: any, { username, email, password }: any) => {
      const user = new User({ username, email, password });
      await user.save();
      return { token: user.generateAuthToken(), user };
    },

    // Save a book to the user's savedBooks
    saveBook: async (parent: any, bookData: any, context: any) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      const book = await Book.create(bookData);
      const user = await User.findByIdAndUpdate(
        context.user._id,
        { $push: { savedBooks: book._id } },
        { new: true }
      ).populate("savedBooks");
      return user;
    },

    // Remove a book from the user's savedBooks
    removeBook: async (parent: any, { bookId }: any, context: any) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      const user = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: bookId } },
        { new: true }
      ).populate("savedBooks");
      return user;
    },
  },
};

export default resolvers;
