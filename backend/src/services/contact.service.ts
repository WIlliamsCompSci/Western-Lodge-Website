import { prisma } from "../lib/prisma";
import { ContactInput } from "../types";

export async function createContactSubmission(data: ContactInput) {
  const submission = await prisma.contactSubmission.create({ data });
  return submission;
}
