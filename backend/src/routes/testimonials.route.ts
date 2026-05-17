import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { featured } = req.query as { featured?: string };

  const where = featured === "true" ? { featured: true } : undefined;

  const testimonials = await prisma.testimonial.findMany({
    where,
    orderBy: { date: "desc" },
  });
  res.json(testimonials);
});

export { router as testimonialsRouter };
