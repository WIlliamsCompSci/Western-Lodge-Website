import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const rooms = await prisma.room.findMany({
    orderBy: { price: "asc" },
  });
  res.json(rooms);
});

export { router as roomsRouter };
