import User from "../models/User";

const resolvers = {
  Query: {
    // Get the current logged-in user's info
    me: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      return await User.findById(context.user._id).populate("savedBooks");
    },
  },

  Mutation: {
    // Login a user
    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.validatePassword(password))) {
        throw new Error("Invalid credentials");
      }
      return { token: user.generateAuthToken(), user };
    },

    // Add a new user
    addUser: async (_: any, { username, email, password }: any) => {
      const user = new User({ username, email, password });
      await user.save();
      return { token: user.generateAuthToken(), user };
    },

    // Save a book to the user's savedBooks (without creating a separate Book document)
    saveBook: async (_: any, { bookId, authors, description, title, image, link }: any, context: any) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      
      const user = await User.findByIdAndUpdate(
        context.user._id,
        { 
          $push: { 
            savedBooks: { bookId, authors, description, title, image, link } // Embed book details
          } 
        },
        { new: true }
      ).populate("savedBooks");
      
      return user;
    },

    // Remove a book from the user's savedBooks
    removeBook: async (_: any, { bookId }: any, context: any) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      const user = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } }, // Remove book by bookId
        { new: true }
      ).populate("savedBooks");
      return user;
    },
  },
};

export default resolvers;
