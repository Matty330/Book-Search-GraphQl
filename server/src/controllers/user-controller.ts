import type { Request, Response } from 'express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { Types } from 'mongoose'; // Import for ObjectId handling

// Get a single user by either their ID or their username
export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const foundUser = await User.findOne({
      $or: [{ _id: req.user ? req.user._id : req.params.id }, { username: req.params.username }],
    });

    if (!foundUser) {
      return res.status(400).json({ message: 'Cannot find a user with this ID!' });
    }

    return res.json(foundUser);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
};

// Create a user, sign a token, and send it back
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);

    if (!user) {
      return res.status(400).json({ message: 'Something went wrong!' });
    }

    // Ensure _id is converted to a string
    const userId = user._id instanceof Types.ObjectId ? user._id.toHexString() : String(user._id);

    const token = signToken(userId, user.username, user.email);
    return res.json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Login a user, sign a token, and send it back
export const login = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });

    if (!user) {
      return res.status(400).json({ message: "Can't find this user" });
    }

    const correctPw = await user.validatePassword(req.body.password);

    if (!correctPw) {
      return res.status(400).json({ message: 'Wrong password!' });
    }

    // Ensure _id is converted to a string
    const userId = user._id instanceof Types.ObjectId ? user._id.toHexString() : String(user._id);

    const token = signToken(userId, user.username, user.email);
    return res.json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Save a book to a user's `savedBooks` field
export const saveBook = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $addToSet: { savedBooks: req.body } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
};

// Remove a book from `savedBooks`
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { savedBooks: { bookId: req.params.bookId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
};
