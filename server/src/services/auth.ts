// server/src/services/auth.ts
import jwt from 'jsonwebtoken';
import { Request } from 'express';

// Set token secret and expiration
const secret = process.env.JWT_SECRET || 'mysecretsshhhhh';
const expiration = '2h';

export interface TokenUser {
  _id: string;
  username: string;
  email: string;
}

export interface MyContext {
  user?: TokenUser;
}

// Function for Apollo Server authentication
export function authMiddleware({ req }: { req: Request }): MyContext {
  // Get token from header
  let token = req.headers.authorization || '';
  
  console.log('Authorization header:', token); // Debugging
  
  // Format as ["Bearer", "<tokenvalue>"]
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trim();
  }
  
  console.log('Token after slicing:', token ? 'Token exists' : 'No token'); // Debugging

  if (!token) {
    return {};
  }

  // Verify token and get user data from it
  try {
    console.log('About to verify token...');
    
    // Try parsing the token first to make sure it's valid JSON
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
      console.log('Parsed token payload:', payload);
    } catch (parseErr) {
      console.log('Error parsing token:', parseErr);
    }
    
    const decoded = jwt.verify(token, secret);
    console.log('Decoded token:', decoded); // Debugging
    
    // Check if decoded has the expected structure
    if (typeof decoded === 'object' && decoded !== null && 'data' in decoded) {
      const { data } = decoded as { data: TokenUser };
      console.log('User data from token:', data); // Debugging
      return { user: data };
    } else {
      console.log('Decoded token does not have expected structure:', decoded); // Debugging
      return {};
    }
  } catch (err) {
    console.log('Error verifying token:', err); // Debugging
    return {};
  }
}

// Function for Express routes authentication (used in REST API)
export function authenticateToken(req: Request, res: any, next: () => void): void {
  // Get token from header
  let token = req.headers.authorization || '';

  // Format as ["Bearer", "<tokenvalue>"]
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trim();
  }

  if (!token) {
    return res.status(401).json({ message: 'You need to be logged in!' });
  }

  // Verify token
  try {
    const { data } = jwt.verify(token, secret) as { data: TokenUser };
    req.user = data;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
}

export function signToken(user: any): string {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email
  };
  
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}