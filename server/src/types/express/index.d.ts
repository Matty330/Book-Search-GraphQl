// server/src/types/express/index.d.ts
declare namespace Express {
  interface Request {
    user: {
      _id: string;
      username: string;
      email: string;
    };
  }
}