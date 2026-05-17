import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("[Error]", err.message, err.stack);
  res.status(err.status ?? 500).json({
    error: err.message ?? "Internal Server Error",
  });
}
