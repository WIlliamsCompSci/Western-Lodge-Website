import { Router, Request, Response } from "express";
import { validate } from "../middleware/validate.middleware";
import { requireAdminSecret } from "../middleware/auth.middleware";
import { BookingInquirySchema } from "../types";
import { createInquiry, listInquiries } from "../services/inquiry.service";

const router = Router();

router.post("/", validate(BookingInquirySchema), async (req: Request, res: Response) => {
  const inquiry = await createInquiry(req.body);
  res.status(201).json({
    id: inquiry.id,
    message: "Booking inquiry submitted successfully. We will contact you within 24 hours.",
  });
});

router.get("/", requireAdminSecret, async (req: Request, res: Response) => {
  const { status, page, limit } = req.query as Record<string, string>;
  const result = await listInquiries({
    status,
    page: page ? parseInt(page) : undefined,
    limit: limit ? parseInt(limit) : undefined,
  });
  res.json(result);
});

export { router as inquiriesRouter };
