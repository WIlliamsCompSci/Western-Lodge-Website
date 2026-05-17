import "dotenv/config";
import { PrismaClient, RoomType, GalleryCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Rooms ────────────────────────────────────────────────────────────────────
  const rooms = [
    {
      name: "Garden View Standard",
      type: RoomType.STANDARD,
      description:
        "A serene retreat nestled among our tropical gardens. Wake up to birdsong and lush greenery through your private window. Thoughtfully appointed with warm timber accents and handcrafted rattan furniture, this room embodies relaxed coastal living.",
      price: 3500,
      capacity: 2,
      amenities: [
        "Air Conditioning",
        "High-Speed WiFi",
        "Smart TV",
        "Hot Shower",
        "Private Bath",
        "Mini Fridge",
        "In-Room Safe",
        "Daily Housekeeping",
      ],
      images: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
        "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80",
      ],
    },
    {
      name: "Oceanfront Deluxe",
      type: RoomType.DELUXE,
      description:
        "Fall asleep to the gentle sound of waves from your private balcony overlooking the Leyte Gulf. This generously sized room features a premium soaking tub, ocean-view seating area, and curated local artwork that celebrates the natural beauty of Samar.",
      price: 5800,
      capacity: 2,
      amenities: [
        "Air Conditioning",
        "High-Speed WiFi",
        "Smart TV",
        "Ocean View Balcony",
        "Soaking Tub",
        "Rainfall Shower",
        "Mini Bar",
        "Nespresso Machine",
        "Bathrobe & Slippers",
        "In-Room Safe",
        "Daily Housekeeping",
      ],
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
        "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=800&q=80",
      ],
    },
    {
      name: "Premium Coastal Suite",
      type: RoomType.SUITE,
      description:
        "Our most expansive accommodation — a sanctuary of refined luxury with panoramic coastal views, a private furnished terrace, and a full kitchenette. Designed for discerning travelers who desire the very best that Marabut has to offer, with dedicated butler service.",
      price: 9500,
      capacity: 4,
      amenities: [
        "Air Conditioning",
        "High-Speed WiFi",
        "Smart TV (65\")",
        "Panoramic Coastal View",
        "Private Furnished Terrace",
        "Full Kitchenette",
        "Freestanding Soaking Tub",
        "Double Rainfall Shower",
        "Nespresso Machine",
        "Premium Mini Bar",
        "Bathrobe & Slippers",
        "Butler Service",
        "In-Room Safe",
        "Daily Turndown Service",
      ],
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
        "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=800&q=80",
      ],
    },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { type: room.type },
      update: room,
      create: room,
    });
  }
  console.log(`✅ Seeded ${rooms.length} rooms`);

  // ── Gallery ───────────────────────────────────────────────────────────────────
  const galleryItems = [
    // ROOMS
    {
      url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=85",
      alt: "Elegant standard room with garden view and natural light",
      category: GalleryCategory.ROOMS,
      order: 1,
    },
    {
      url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=85",
      alt: "Luxurious deluxe room with ocean view balcony",
      category: GalleryCategory.ROOMS,
      order: 2,
    },
    {
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85",
      alt: "Premium coastal suite with panoramic sea views",
      category: GalleryCategory.ROOMS,
      order: 3,
    },
    // AMENITIES
    {
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=85",
      alt: "Rooftop bar with stunning sunset views over the sea",
      category: GalleryCategory.AMENITIES,
      order: 4,
    },
    {
      url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=85",
      alt: "Traditional spa and massage therapy room",
      category: GalleryCategory.AMENITIES,
      order: 5,
    },
    {
      url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&q=85",
      alt: "Fresh seafood dining at our on-site restaurant",
      category: GalleryCategory.AMENITIES,
      order: 6,
    },
    // EXTERIOR
    {
      url: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=1200&q=85",
      alt: "Hotel exterior with lush tropical landscaping",
      category: GalleryCategory.EXTERIOR,
      order: 7,
    },
    {
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=85",
      alt: "Swimming pool area with ocean backdrop",
      category: GalleryCategory.EXTERIOR,
      order: 8,
    },
    {
      url: "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?w=1200&q=85",
      alt: "Beachfront terrace and garden at golden hour",
      category: GalleryCategory.EXTERIOR,
      order: 9,
    },
    // DINING
    {
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85",
      alt: "Elegantly set dining table with coastal decor",
      category: GalleryCategory.DINING,
      order: 10,
    },
    {
      url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=85",
      alt: "Fresh Filipino cuisine with local seafood",
      category: GalleryCategory.DINING,
      order: 11,
    },
    {
      url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=85",
      alt: "Tropical cocktails at the rooftop bar",
      category: GalleryCategory.DINING,
      order: 12,
    },
    // SURROUNDINGS
    {
      url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=85",
      alt: "Crystal clear waters of Marabut Marine Park",
      category: GalleryCategory.SURROUNDINGS,
      order: 13,
    },
    {
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=85",
      alt: "Limestone karst islands at sunset",
      category: GalleryCategory.SURROUNDINGS,
      order: 14,
    },
    {
      url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=85",
      alt: "Pristine white sand beach near the lodge",
      category: GalleryCategory.SURROUNDINGS,
      order: 15,
    },
  ];

  await prisma.galleryItem.deleteMany();
  await prisma.galleryItem.createMany({ data: galleryItems });
  console.log(`✅ Seeded ${galleryItems.length} gallery items`);

  // ── Testimonials ───────────────────────────────────────────────────────────────
  const testimonials = [
    {
      guestName: "Maria Santos",
      location: "Manila, Philippines",
      rating: 5,
      review:
        "Waking up to the sound of waves from our balcony was something I'll never forget. The suite was breathtaking — every detail felt intentional and luxurious. The staff's warmth made it feel like coming home. We'll be back for our anniversary.",
      date: new Date("2024-11-15"),
      featured: true,
    },
    {
      guestName: "James Whitfield",
      location: "Sydney, Australia",
      rating: 5,
      review:
        "The Coastal Suite exceeded every expectation. I've stayed at luxury hotels across Southeast Asia, and Western Highway Lodge stands out for its genuine character and exceptional service. The rooftop bar at sunset is absolutely magical.",
      date: new Date("2024-10-22"),
      featured: true,
    },
    {
      guestName: "Rina Nakamura",
      location: "Osaka, Japan",
      rating: 5,
      review:
        "The staff warmth is truly unmatched. From the moment we arrived to checkout, every interaction felt personal and genuine. The traditional massage was deeply restorative. Marabut's natural beauty paired with this lodge is a hidden treasure.",
      date: new Date("2024-12-03"),
      featured: false,
    },
    {
      guestName: "David Chen",
      location: "Singapore",
      rating: 5,
      review:
        "The rooftop bar at sunset is one of the most beautiful views I've experienced anywhere in the world. Watching the sun dip behind the limestone islands while sipping a craft cocktail — pure magic. The food was also surprisingly excellent.",
      date: new Date("2024-09-18"),
      featured: true,
    },
    {
      guestName: "Ana Reyes",
      location: "Cebu, Philippines",
      rating: 5,
      review:
        "Perfect anniversary getaway. My husband surprised me with the Deluxe room and it was absolutely beautiful. The ocean view from our balcony, the spa treatments, the fresh seafood at dinner — every moment was memorable. Thank you for the special touches!",
      date: new Date("2024-08-30"),
      featured: false,
    },
    {
      guestName: "Michael Torres",
      location: "New York, USA",
      rating: 5,
      review:
        "Marabut is a hidden gem, and Western Highway Lodge is its crown jewel. I came for the island hopping and snorkeling, but stayed longer just to enjoy the lodge itself. The standard room was beautifully designed and incredibly comfortable. Will recommend to everyone.",
      date: new Date("2024-07-12"),
      featured: false,
    },
  ];

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({ data: testimonials });
  console.log(`✅ Seeded ${testimonials.length} testimonials`);

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
