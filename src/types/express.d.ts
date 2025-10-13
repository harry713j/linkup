import * as express from "express";

type UserCtx = {
  id: string;
  email?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: UserCtx;
    }
  }
}
