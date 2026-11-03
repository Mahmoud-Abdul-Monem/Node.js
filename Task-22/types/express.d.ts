export {};

declare global {
  namespace Express {
    interface UserSession {
      _id: string;
      username: string;
      email: string;
      image?: string | null;
      createdAt: Date;
      updatedAt: Date;
    }

    interface Request {
      user?: UserSession;
    }
  }
}
