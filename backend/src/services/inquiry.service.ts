import { prisma } from "../lib/prisma";
import { BookingInquiryInput } from "../types";
import {
  sendBookingConfirmationToGuest,
  sendBookingNotificationToHotel,
} from "./email.service";

export async function createInquiry(data: BookingInquiryInput) {
  const inquiry = await prisma.bookingInquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      roomType: data.roomType,
      guests: data.guests,
      specialRequests: data.specialRequests,
    },
  });

  await Promise.allSettled([
    sendBookingConfirmationToGuest(inquiry),
    sendBookingNotificationToHotel(inquiry),
  ]);

  return inquiry;
}

export async function listInquiries(params: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = params.page ?? 1;
  const limit = Math.min(params.limit ?? 20, 100);
  const skip = (page - 1) * limit;

  const where = params.status ? { status: params.status as "PENDING" | "CONFIRMED" | "CANCELLED" } : {};

  const [items, total] = await Promise.all([
    prisma.bookingInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.bookingInquiry.count({ where }),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}
