import express, { Request, Response } from "express";

const router = express.Router();

router.route("/").all(function (req: Request, res: Response) {
  res.status(404).json({
    message: "Route not found",
  });
});

export default router;
