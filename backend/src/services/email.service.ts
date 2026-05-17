import { Resend } from "resend";
import { BookingInquiryInput } from "../types";

const resend = new Resend(process.env.RESEND_API_KEY);

type InquiryWithId = Omit<BookingInquiryInput, "specialRequests"> & {
  id: string;
  specialRequests?: string | null;
};

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

const ROOM_LABELS: Record<string, string> = {
  STANDARD: "Garden View Standard",
  DELUXE: "Oceanfront Deluxe",
  SUITE: "Premium Coastal Suite",
};

function buildGuestEmailHtml(inquiry: InquiryWithId): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#F5EDD6;font-family:'Montserrat',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EDD6;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FBF7EF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:#1B6B7B;padding:40px 48px;text-align:center;">
              <h1 style="color:#FBF7EF;font-size:28px;font-weight:700;margin:0;letter-spacing:1px;">WESTERN HIGHWAY LODGE</h1>
              <p style="color:#9FCDD6;font-size:13px;margin:8px 0 0;letter-spacing:3px;text-transform:uppercase;">Marabut, Samar Province, Philippines</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:48px;">
              <h2 style="color:#1B6B7B;font-size:22px;margin:0 0 8px;">Booking Inquiry Received</h2>
              <p style="color:#6B7280;font-size:15px;margin:0 0 32px;line-height:1.7;">
                Dear ${inquiry.name}, thank you for your interest in Western Highway Lodge. We have received your booking inquiry and will confirm availability within 24 hours.
              </p>
              <!-- Booking Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EDD6;border-radius:12px;padding:24px;margin-bottom:32px;">
                <tr><td colspan="2" style="padding-bottom:16px;"><strong style="color:#1B6B7B;font-size:13px;text-transform:uppercase;letter-spacing:2px;">Booking Summary</strong></td></tr>
                <tr>
                  <td style="color:#6B7280;font-size:14px;padding:6px 0;">Check-in</td>
                  <td style="color:#1A1A1A;font-size:14px;font-weight:600;text-align:right;">${formatDate(inquiry.checkIn)}</td>
                </tr>
                <tr>
                  <td style="color:#6B7280;font-size:14px;padding:6px 0;">Check-out</td>
                  <td style="color:#1A1A1A;font-size:14px;font-weight:600;text-align:right;">${formatDate(inquiry.checkOut)}</td>
                </tr>
                <tr>
                  <td style="color:#6B7280;font-size:14px;padding:6px 0;">Room</td>
                  <td style="color:#1A1A1A;font-size:14px;font-weight:600;text-align:right;">${ROOM_LABELS[inquiry.roomType] ?? inquiry.roomType}</td>
                </tr>
                <tr>
                  <td style="color:#6B7280;font-size:14px;padding:6px 0;">Guests</td>
                  <td style="color:#1A1A1A;font-size:14px;font-weight:600;text-align:right;">${inquiry.guests}</td>
                </tr>
                ${inquiry.specialRequests ? `
                <tr>
                  <td style="color:#6B7280;font-size:14px;padding:6px 0;vertical-align:top;">Special Requests</td>
                  <td style="color:#1A1A1A;font-size:14px;font-weight:600;text-align:right;">${inquiry.specialRequests}</td>
                </tr>` : ""}
                <tr>
                  <td style="color:#6B7280;font-size:14px;padding:6px 0;">Reference ID</td>
                  <td style="color:#1B6B7B;font-size:12px;font-weight:600;text-align:right;font-family:monospace;">${inquiry.id}</td>
                </tr>
              </table>
              <p style="color:#6B7280;font-size:14px;line-height:1.7;margin:0 0 32px;">
                Our reservations team will review your inquiry and send a confirmation with rates and availability shortly. If you have urgent questions, please reach us at <a href="mailto:info@westernhighwaylodge.com" style="color:#1B6B7B;">info@westernhighwaylodge.com</a>.
              </p>
              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${process.env.CORS_ORIGIN ?? "http://localhost:3000"}" style="display:inline-block;background-color:#C1603A;color:#FBF7EF;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:1px;padding:14px 36px;border-radius:8px;text-transform:uppercase;">Visit Our Website</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#1B6B7B;padding:24px 48px;text-align:center;">
              <p style="color:#9FCDD6;font-size:12px;margin:0;">© ${new Date().getFullYear()} Western Highway Lodge · Marabut, Samar Province, Philippines</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildHotelEmailHtml(inquiry: InquiryWithId): string {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;padding:20px;background:#F5EDD6;">
  <div style="background:#FBF7EF;border-radius:12px;padding:32px;max-width:600px;margin:0 auto;">
    <h2 style="color:#1B6B7B;margin:0 0 24px;">New Booking Inquiry</h2>
    <table width="100%">
      <tr><td style="color:#6B7280;padding:6px 0;">Name</td><td style="font-weight:600;">${inquiry.name}</td></tr>
      <tr><td style="color:#6B7280;padding:6px 0;">Email</td><td><a href="mailto:${inquiry.email}">${inquiry.email}</a></td></tr>
      <tr><td style="color:#6B7280;padding:6px 0;">Phone</td><td>${inquiry.phone}</td></tr>
      <tr><td style="color:#6B7280;padding:6px 0;">Check-in</td><td style="font-weight:600;">${formatDate(inquiry.checkIn)}</td></tr>
      <tr><td style="color:#6B7280;padding:6px 0;">Check-out</td><td style="font-weight:600;">${formatDate(inquiry.checkOut)}</td></tr>
      <tr><td style="color:#6B7280;padding:6px 0;">Room Type</td><td style="font-weight:600;">${ROOM_LABELS[inquiry.roomType] ?? inquiry.roomType}</td></tr>
      <tr><td style="color:#6B7280;padding:6px 0;">Guests</td><td>${inquiry.guests}</td></tr>
      ${inquiry.specialRequests ? `<tr><td style="color:#6B7280;padding:6px 0;vertical-align:top;">Special Requests</td><td>${inquiry.specialRequests}</td></tr>` : ""}
      <tr><td style="color:#6B7280;padding:6px 0;">Reference ID</td><td style="font-family:monospace;font-size:12px;color:#1B6B7B;">${inquiry.id}</td></tr>
    </table>
  </div>
</body>
</html>`;
}

export async function sendBookingConfirmationToGuest(inquiry: InquiryWithId): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log("[Email] RESEND_API_KEY not set — skipping guest email");
    return;
  }
  await resend.emails.send({
    from: "Western Highway Lodge <noreply@westernhighwaylodge.com>",
    to: inquiry.email,
    subject: "Booking Inquiry Received — Western Highway Lodge",
    html: buildGuestEmailHtml(inquiry),
  });
}

export async function sendBookingNotificationToHotel(inquiry: InquiryWithId): Promise<void> {
  if (!process.env.RESEND_API_KEY || !process.env.HOTEL_EMAIL) {
    console.log("[Email] RESEND_API_KEY or HOTEL_EMAIL not set — skipping hotel email");
    return;
  }
  await resend.emails.send({
    from: "Booking System <noreply@westernhighwaylodge.com>",
    to: process.env.HOTEL_EMAIL,
    subject: `New Booking Inquiry from ${inquiry.name} — ${formatDate(inquiry.checkIn)}`,
    html: buildHotelEmailHtml(inquiry),
  });
}
