import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { GalleryCategory } from "@prisma/client";

const router = Router();

const VALID_CATEGORIES = ["ROOMS", "AMENITIES", "EXTERIOR", "DINING", "SURROUNDINGS"];

router.get("/", async (req: Request, res: Response) => {
  const { category } = req.query as { category?: string };

  const where =
    category && VALID_CATEGORIES.includes(category.toUpperCase())
      ? { category: category.toUpperCase() as GalleryCategory }
      : undefined;

  const items = await prisma.galleryItem.findMany({
    where,
    orderBy: { order: "asc" },
  });
  res.json(items);
});

export { router as galleryRouter };
