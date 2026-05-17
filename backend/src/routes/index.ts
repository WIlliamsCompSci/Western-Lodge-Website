import { Router } from "express";
import { inquiriesRouter } from "./inquiries.route";
import { roomsRouter } from "./rooms.route";
import { galleryRouter } from "./gallery.route";
import { testimonialsRouter } from "./testimonials.route";
import { contactRouter } from "./contact.route";

const router = Router();

router.use("/inquiries", inquiriesRouter);
router.use("/rooms", roomsRouter);
router.use("/gallery", galleryRouter);
router.use("/testimonials", testimonialsRouter);
router.use("/contact", contactRouter);

export { router as apiRouter };
