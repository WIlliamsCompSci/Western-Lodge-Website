import { Router, Request, Response } from "express";
import { validate } from "../middleware/validate.middleware";
import { ContactSchema } from "../types";
import { createContactSubmission } from "../services/contact.service";

const router = Router();

router.post("/", validate(ContactSchema), async (req: Request, res: Response) => {
  await createContactSubmission(req.body);
  res.status(201).json({
    message: "Message received. We will get back to you shortly.",
  });
});

export { router as contactRouter };
