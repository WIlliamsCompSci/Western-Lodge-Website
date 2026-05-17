import { z } from "zod";

export const BookingInquirySchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(7, "Phone number must be at least 7 characters").max(20),
    checkIn: z.coerce.date().refine((d) => d >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "Check-in date must be today or in the future",
    }),
    checkOut: z.coerce.date(),
    roomType: z.enum(["STANDARD", "DELUXE", "SUITE"], {
      required_error: "Please select a room type",
    }),
    guests: z.coerce.number().int().min(1).max(6),
    specialRequests: z.string().max(1000).optional(),
  })
  .refine((d) => d.checkOut > d.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

export const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export type BookingInquiryInput = z.infer<typeof BookingInquirySchema>;
export type ContactInput = z.infer<typeof ContactSchema>;
