/**
 * EMBER & SPICE — database seed
 * Run with: npx tsx scripts/seed.ts
 * Idempotent: exits early if an admin user already exists.
 */
import "dotenv/config";
import { db } from "../src/db/index";
import {
  users,
  categories,
  menuItems,
  galleryImages,
  reservations,
  reviews,
  settings,
} from "../src/db/schema";
import { hashPassword } from "../src/lib/password";
import { DEFAULT_SETTINGS } from "../src/lib/settings";

const IMG = {
  hero: "/images/hero.jpg",
  interior: "/images/interior.jpg",
  kitchen: "/images/kitchen.jpg",
  dosa: "/images/food/masala-dosa.jpg",
  podi: "/images/food/podi-idli.jpg",
  chicken65: "/images/food/chicken-65.jpg",
  biryani: "/images/food/biryani.jpg",
  coffee: "/images/food/filter-coffee.jpg",
  meals: "/images/food/meals.jpg",
  payasam: "/images/food/payasam.jpg",
};

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;

const CATS = [
  "Breakfast",
  "Dosas",
  "Starters",
  "South Indian Classics",
  "Main Course",
  "Biryani",
  "Rice",
  "Sides",
  "Desserts",
  "Beverages",
];

const slug = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

type Item = {
  name: string;
  cat: string;
  price: number;
  desc: string;
  img?: string;
  veg?: boolean;
  sig?: boolean;
};

const MENU: Item[] = [
  // BREAKFAST
  { name: "Ghee Podi Idli", cat: "Breakfast", price: 140, sig: true, img: IMG.podi,
    desc: "Bite-sized idlis tossed in our house-ground gunpowder podi, hot ghee and crackled curry leaves." },
  { name: "Medhu Vada (2 pc)", cat: "Breakfast", price: 95, img: px(20422132),
    desc: "Golden, crisp-edged urad dal vadas with a cloud-soft centre. Sambar and chutney alongside." },
  { name: "Ven Pongal", cat: "Breakfast", price: 120, img: px(34159107),
    desc: "Slow-simmered rice and moong dal with black pepper, cumin, ginger and a generous pour of ghee." },
  { name: "Set Dosai with Sambar", cat: "Breakfast", price: 115, img: px(20422131),
    desc: "Two soft, spongy dosas served with sambar and the day's three chutneys." },
  // DOSAS
  { name: "Masala Dosa", cat: "Dosas", price: 160, sig: true, img: IMG.dosa,
    desc: "Our crisp signature crepe wrapped around spiced potato masala, with sambar and two chutneys." },
  { name: "Ghee Roast Dosa", cat: "Dosas", price: 150, img: px(20422138),
    desc: "Paper-thin, roasted to a deep amber in pure ghee until shatteringly crisp." },
  { name: "Onion Rava Dosa", cat: "Dosas", price: 170, img: px(20422133),
    desc: "Lacy semolina crepe studded with onions, green chillies and crushed pepper." },
  { name: "Paneer Masala Dosa", cat: "Dosas", price: 190, img: px(35351659),
    desc: "Golden dosa folded over a gently spiced paneer bhurji with curry leaf." },
  { name: "Plain Dosa", cat: "Dosas", price: 110, img: px(20422129),
    desc: "The classic. Fermented rice-and-dal crepe — crisp edges, soft middle." },
  // STARTERS
  { name: "Chicken 65", cat: "Starters", price: 260, sig: true, veg: false, img: IMG.chicken65,
    desc: "Fiery, crackle-fried chicken tossed with curry leaves, red chillies and crushed pepper — a Coimbatore favourite, done right." },
  { name: "Chettinad Pepper Chicken", cat: "Starters", price: 300, veg: false, img: px(29684985),
    desc: "Bone-in chicken seared with stone-ground Chettinad masala and Tellicherry pepper." },
  { name: "Gobi 65", cat: "Starters", price: 190, img: px(9345647),
    desc: "Crisp cauliflower florets in a spiced 65-style fry, finished with curry leaves and lime." },
  { name: "Mutton Chukka", cat: "Starters", price: 390, veg: false, img: px(34159112),
    desc: "Slow-cooked mutton dry-roasted with shallots, pepper and fennel until dark and caramelised." },
  // CLASSICS
  { name: "Ember Banana-Leaf Meals", cat: "South Indian Classics", price: 240, sig: true, img: IMG.meals,
    desc: "The full afternoon spread on a fresh banana leaf: rice, sambar, rasam, kootu, poriyal, appalam, pickle and curd." },
  { name: "Non-Veg Meals", cat: "South Indian Classics", price: 340, veg: false, img: px(8818732),
    desc: "Our banana-leaf meals with the day's chicken or fish curry included. Ask what's on." },
  { name: "Sambar Sadham", cat: "South Indian Classics", price: 150, img: px(12669168),
    desc: "Comfort in a bowl — rice simmered down with toor dal, vegetables and our sambar powder." },
  // MAINS
  { name: "Chettinad Chicken Curry", cat: "Main Course", price: 320, sig: true, veg: false, img: px(10810653),
    desc: "The classic of the region — dark-roasted spices, black pepper and coconut in a rich gravy." },
  { name: "Mutton Pepper Fry", cat: "Main Course", price: 410, veg: false, img: px(12089284),
    desc: "Tender mutton tossed in a pepper-heavy masala until the edges catch and crisp." },
  { name: "Vegetable Kurma", cat: "Main Course", price: 210, img: px(8818657),
    desc: "Seasonal vegetables in a coconut-and-cashew kurma — gentle, fragrant, no shortcuts." },
  { name: "Kadai Paneer", cat: "Main Course", price: 270, img: px(9345667),
    desc: "Paneer tossed with charred peppers, tomato and freshly crushed coriander seed." },
  // BIRYANI
  { name: "Chicken Biryani", cat: "Biryani", price: 290, sig: true, veg: false, img: IMG.biryani,
    desc: "Seeraga samba rice layered with chicken, mint and fried onions, sealed and steamed. Salna and raita alongside." },
  { name: "Mutton Biryani", cat: "Biryani", price: 390, veg: false, img: px(34159106),
    desc: "The weekend favourite — mutton cooked down with whole spices before the rice goes in." },
  { name: "Vegetable Biryani", cat: "Biryani", price: 220, img: px(34159109),
    desc: "Seasonal vegetables layered with samba rice, saffron and mint, dum-style." },
  // RICE
  { name: "Lemon Rice", cat: "Rice", price: 125, img: px(34159107),
    desc: "Bright with lemon, curry leaves and roasted groundnuts — light and quick." },
  { name: "Pepper Rasam Rice", cat: "Rice", price: 125, img: px(12089284),
    desc: "Hot rasam poured over soft rice with a spoon of ghee. The remedy for everything." },
  { name: "Curd Rice", cat: "Rice", price: 110, img: px(35267281),
    desc: "Cool, creamy curd rice tempered with mustard, ginger and pomegranate." },
  { name: "Coconut Rice", cat: "Rice", price: 130,
    desc: "Rice tossed with fresh coconut, cashew and curry-leaf tempering." },
  { name: "Tomato Rice", cat: "Rice", price: 125,
    desc: "Home-style tomato rice with a whisper of roasted masala." },
  // SIDES
  { name: "Sambar (Extra)", cat: "Sides", price: 40, desc: "An extra katori of the day's sambar." },
  { name: "Coconut Chutney", cat: "Sides", price: 30, desc: "Ground fresh through the morning." },
  { name: "Gunpowder Podi & Ghee", cat: "Sides", price: 35, desc: "Our signature podi with a spoon of hot ghee." },
  { name: "Masala Appalam", cat: "Sides", price: 30, desc: "Crisp appalam topped with onion, tomato and chilli." },
  { name: "Onion Raita", cat: "Sides", price: 50, desc: "Whisked curd with onion, green chilli and coriander." },
  // DESSERTS
  { name: "Paruppu Payasam", cat: "Desserts", price: 140, sig: true, img: IMG.payasam,
    desc: "Moong dal slow-cooked in jaggery and coconut milk, topped with ghee-roasted cashews." },
  { name: "Gulab Jamun (2 pc)", cat: "Desserts", price: 110, img: px(37294501),
    desc: "Soft khoya dumplings in warm rose-cardamom syrup." },
  { name: "Rava Kesari", cat: "Desserts", price: 95,
    desc: "Silky kesari with saffron, ghee and roasted cashew." },
  { name: "Filter-Coffee Ice Cream", cat: "Desserts", price: 130,
    desc: "Churned with a double shot of decoction. Order it — trust us." },
  // BEVERAGES
  { name: "Madras Filter Coffee", cat: "Beverages", price: 60, sig: true, img: IMG.coffee,
    desc: "Peaberry-chicory blend, frothed dabara-to-tumbler at the counter." },
  { name: "Masala Chai", cat: "Beverages", price: 50, img: px(17473024),
    desc: "Assam leaves simmered with ginger, cardamom and milk." },
  { name: "Sukku Malli Coffee", cat: "Beverages", price: 55, img: px(36662612),
    desc: "Dry-ginger coffee — earthy, warming and entirely caffeine-free." },
  { name: "Fresh Lime Soda", cat: "Beverages", price: 70, desc: "Sweet, salted or mixed. Made to order." },
  { name: "Rose Milk", cat: "Beverages", price: 90, desc: "Chilled milk with house rose syrup and basil seeds." },
  { name: "Neer More (Buttermilk)", cat: "Beverages", price: 50, desc: "Spiced buttermilk with curry leaf and ginger." },
  { name: "Watermelon Juice", cat: "Beverages", price: 120, desc: "Fresh-pressed, no added sugar." },
];

const GALLERY: { title: string; category: string; url: string }[] = [
  { title: "Ghee roast, folded", category: "Food", url: IMG.dosa },
  { title: "Chicken 65, off the flame", category: "Food", url: IMG.chicken65 },
  { title: "Seeraga samba biryani", category: "Food", url: IMG.biryani },
  { title: "Podi idlis, morning batch", category: "Food", url: IMG.podi },
  { title: "The banana-leaf spread", category: "Food", url: IMG.meals },
  { title: "Dosa, top down", category: "Food", url: px(20422138) },
  { title: "Clay-pot chicken curry", category: "Food", url: px(34159112) },
  { title: "Gulab jamun, warm", category: "Food", url: px(37294501) },
  { title: "The dining room, evening", category: "Interior", url: IMG.interior },
  { title: "Corner tables", category: "Interior", url: px(9495784) },
  { title: "Set for dinner service", category: "Interior", url: px(29707940) },
  { title: "A table for the evening", category: "People", url: px(30420679) },
  { title: "Dinner, shared", category: "People", url: px(3937681) },
  { title: "Before the meal", category: "People", url: px(8818667) },
  { title: "The nine-second pour", category: "Details", url: IMG.coffee },
  { title: "Tempering, to order", category: "Details", url: IMG.kitchen },
  { title: "Payasam, still warm", category: "Details", url: IMG.payasam },
  { title: "Chai, first rain", category: "Details", url: px(36662612) },
];

const REVIEWS = [
  { customerName: "Priya S.", rating: 5, date: "March 2026",
    review: "The podi idli alone is worth the drive across town. Warm, unhurried service and a room that actually feels considered." },
  { customerName: "Karthik R.", rating: 5, date: "February 2026",
    review: "The best ghee roast I've had in Coimbatore in years — crisp all the way through. The filter coffee finished it properly." },
  { customerName: "Deepa & Arun", rating: 4, date: "February 2026",
    review: "Took the whole family for Sunday lunch. The banana-leaf meals kept everyone happy, from my father-in-law to the kids." },
  { customerName: "Sanjana M.", rating: 5, date: "January 2026",
    review: "The biryani tastes of real spice, not just heat. We booked our next table before we left." },
  { customerName: "Vignesh T.", rating: 4, date: "January 2026",
    review: "Quiet, well-run room. The Chicken 65 had proper crunch and the staff steered us well. Payasam is a must." },
];

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

async function main() {
  const existing = await db.select().from(users).limit(1);
  if (existing.length > 0) {
    console.log("Already seeded — skipping.");
    process.exit(0);
  }

  // Admin user (credentials configurable via env; documented in README)
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@emberandspice.in";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ember-admin-2026";
  await db.insert(users).values({
    email: adminEmail,
    passwordHash: hashPassword(adminPassword),
    name: "Restaurant Manager",
  });
  console.log(`Admin user created: ${adminEmail}`);

  // Categories
  const catIds = new Map<string, number>();
  for (const [i, name] of CATS.entries()) {
    const [row] = await db
      .insert(categories)
      .values({ name, slug: slug(name), sortOrder: i + 1, enabled: true })
      .returning({ id: categories.id });
    catIds.set(name, row.id);
  }

  // Menu
  for (const [i, item] of MENU.entries()) {
    await db.insert(menuItems).values({
      name: item.name,
      slug: slug(`${item.name}-${i}`),
      categoryId: catIds.get(item.cat) ?? null,
      description: item.desc,
      price: item.price,
      image: item.img ?? "",
      vegetarian: item.veg ?? true,
      signature: item.sig ?? false,
      available: true,
      sortOrder: i + 1,
    });
  }

  // Gallery
  for (const [i, g] of GALLERY.entries()) {
    await db.insert(galleryImages).values({
      title: g.title,
      category: g.category,
      imageUrl: g.url,
      sortOrder: i + 1,
    });
  }

  // Reviews (clearly marked demo/sample)
  for (const r of REVIEWS) {
    await db.insert(reviews).values({ ...r, approved: true, sample: true });
  }

  // Demo reservations
  const today = new Date().toISOString().slice(0, 10);
  const resSeed = [
    { name: "Aarthi N", phone: "+91 98XXX 40112", email: "aarthi@example.com", d: 2, time: "19:30", guests: 2, status: "confirmed" },
    { name: "Rohit Menon", phone: "+91 98XXX 77405", email: "", d: 3, time: "13:00", guests: 4, status: "pending" },
    { name: "Fathima Beevi", phone: "+91 98XXX 22031", email: "fathima@example.com", d: 5, time: "20:00", guests: 6, status: "pending" },
    { name: "Sundar V", phone: "+91 98XXX 91850", email: "", d: 7, time: "12:30", guests: 3, status: "confirmed" },
    { name: "Nisha & Rahul", phone: "+91 98XXX 55372", email: "nisha@example.com", d: 9, time: "19:00", guests: 2, status: "pending" },
    { name: "Pradeep Kumar", phone: "+91 98XXX 33618", email: "", d: 12, time: "08:30", guests: 5, status: "cancelled" },
  ];
  for (const r of resSeed) {
    await db.insert(reservations).values({
      name: r.name,
      phone: r.phone,
      email: r.email,
      date: addDays(today, r.d),
      time: r.time,
      guests: r.guests,
      specialRequest: "",
      status: r.status,
    });
  }

  // Settings
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await db.insert(settings).values({
      key,
      value: typeof value === "string" ? value : JSON.stringify(value),
    });
  }

  console.log("Seed complete:", {
    categories: CATS.length,
    menuItems: MENU.length,
    gallery: GALLERY.length,
    reviews: REVIEWS.length,
    reservations: resSeed.length,
  });
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
