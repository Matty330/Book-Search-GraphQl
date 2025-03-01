import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Import schema from Book.ts (no .js extension)
import bookSchema from './Book';
import type { BookDocument } from './Book';

export interface UserDocument extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: BookDocument[];
  validatePassword(password: string): Promise<boolean>;
  generateAuthToken(): string;
  bookCount: number;
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // Use Book schema array
    savedBooks: [bookSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hash password before saving
userSchema.pre<UserDocument>('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Compare and validate password
userSchema.methods.validatePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Generate JWT
userSchema.methods.generateAuthToken = function () {
  const secret = process.env.JWT_SECRET || 'default_secret_key';
  return jwt.sign({ id: this._id }, secret, { expiresIn: '1h' });
};

// Virtual for book count
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

const User = model<UserDocument>('User', userSchema);

export default User;
