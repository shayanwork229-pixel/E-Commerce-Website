import imagePools from "./images.json";
export type Sub = { slug: string; name: string; kw: string; nouns: string[] };
export type Category = { slug: string; name: string; emoji: string; subs: Sub[] };
export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categoryName: string;
  sub: string;
  subName: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  stock: number;
  sold: number;
  isNew: boolean;
  images: string[];
  description: string;
  colors: string[];
  sizes: string[];
  addedDaysAgo: number;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const S = (name: string, kw: string, nouns: string[]): Sub => ({
  slug: slugify(name),
  name,
  kw,
  nouns,
});
const C = (name: string, emoji: string, subs: Sub[]): Category => ({
  slug: slugify(name),
  name,
  emoji,
  subs,
});

export const categories: Category[] = [
  C("Mobiles & Electronics", "📱", [
    S("Smartphones", "smartphone", ["Smartphone", "5G Phone", "Pro Phone", "Lite Phone"]),
    S("Tablets", "tablet", ["Tablet", "Tab Pro", "Kids Tablet"]),
    S("Smart Watches", "smartwatch", ["Smart Watch", "Fitness Band", "Watch Ultra"]),
    S("Earbuds & Headphones", "headphones", [
      "Wireless Earbuds",
      "Over-Ear Headphones",
      "Neckband",
    ]),
    S("Power Banks", "powerbank", ["Power Bank", "Magnetic Power Bank", "Fast Charge Bank"]),
    S("Speakers", "speaker", ["Bluetooth Speaker", "Party Speaker", "Mini Speaker"]),
    S("Cameras", "camera", ["Mirrorless Camera", "Action Camera", "Instant Camera"]),
    S("Televisions", "television", ["Smart LED TV", "4K UHD TV", "QLED TV"]),
    S("Gaming Consoles", "gameconsole", ["Gaming Console", "Handheld Console", "Controller"]),
  ]),
  C("Men's Fashion", "👔", [
    S("T-Shirts", "tshirt", ["Cotton Tee", "Graphic T-Shirt", "Polo Shirt"]),
    S("Shirts", "shirt", ["Oxford Shirt", "Casual Shirt", "Linen Shirt"]),
    S("Jeans", "jeans", ["Slim Fit Jeans", "Straight Jeans", "Denim"]),
    S("Hoodies", "hoodie", ["Pullover Hoodie", "Zip Hoodie", "Fleece Hoodie"]),
    S("Jackets", "jacket", ["Bomber Jacket", "Puffer Jacket", "Denim Jacket"]),
    S("Shalwar Kameez", "kurta", ["Shalwar Kameez", "Wash & Wear Suit", "Kurta Set"]),
  ]),
  C("Women's Fashion", "👗", [
    S("Dresses", "dress", ["Maxi Dress", "Midi Dress", "Party Dress"]),
    S("Kurtis", "kurti", ["Printed Kurti", "Embroidered Kurti", "Lawn Kurti"]),
    S("Women's Suits", "salwar", ["3-Piece Lawn Suit", "Khaddar Suit", "Chiffon Suit"]),
    S("Abayas & Hijabs", "hijab", ["Abaya", "Chiffon Hijab", "Jersey Hijab"]),
    S("Handbags", "handbag", ["Tote Bag", "Shoulder Bag", "Clutch"]),
    S("Jewellery", "jewelry", ["Necklace Set", "Earrings", "Bracelet"]),
  ]),
  C("Shoes & Watches", "👟", [
    S("Sneakers", "sneakers", ["Sneakers", "Running Shoes", "Court Sneakers"]),
    S("Formal Shoes", "oxfordshoes", ["Oxford Shoes", "Loafers", "Derby Shoes"]),
    S("Sandals", "sandals", ["Sandals", "Peshawari Chappal", "Slides"]),
    S("Men's Watches", "wristwatch", ["Chronograph Watch", "Analog Watch", "Steel Watch"]),
    S("Women's Watches", "womenwatch", ["Rose Gold Watch", "Bracelet Watch", "Minimal Watch"]),
  ]),
  C("Beauty & Personal Care", "💄", [
    S("Makeup", "makeup", ["Matte Lipstick", "Foundation", "Eyeshadow Palette"]),
    S("Skincare", "skincare", ["Vitamin C Serum", "Night Cream", "Sunscreen SPF 50"]),
    S("Perfumes", "perfume", ["Eau de Parfum", "Attar", "Body Mist"]),
    S("Hair Care", "shampoo", ["Shampoo", "Hair Oil", "Conditioner"]),
    S("Men's Grooming", "beardtrimmer", ["Beard Trimmer", "Beard Oil", "Shaving Kit"]),
  ]),
  C("Home & Kitchen", "🏠", [
    S("Furniture", "furniture", ["Sofa", "Coffee Table", "Accent Chair"]),
    S("Home Decoration", "homedecor", ["Wall Art", "Vase", "Decor Mirror"]),
    S("Lighting", "lamp", ["Table Lamp", "Pendant Light", "LED Strip"]),
    S("Kitchen Appliances", "blender", ["Blender", "Air Fryer", "Electric Kettle"]),
    S("Cookware", "cookware", ["Non-Stick Pan", "Pressure Cooker", "Cookware Set"]),
    S("Bedding", "bedding", ["Bed Sheet Set", "Comforter", "Pillow Pair"]),
  ]),
  C("Grocery & Food", "🛒", [
    S("Rice & Grains", "rice", ["Basmati Rice", "Sella Rice", "Daal"]),
    S("Snacks", "snacks", ["Nimko Mix", "Potato Chips", "Cookies"]),
    S("Chocolates", "chocolate", ["Milk Chocolate", "Dark Chocolate", "Chocolate Box"]),
    S("Tea & Coffee", "tea", ["Black Tea", "Green Tea", "Instant Coffee"]),
    S("Beverages", "juice", ["Fruit Juice", "Sparkling Drink", "Mineral Water"]),
  ]),
  C("Sports & Fitness", "🏏", [
    S("Gym Equipment", "dumbbell", ["Dumbbell Set", "Kettlebell", "Resistance Bands"]),
    S("Cricket", "cricket", ["English Willow Bat", "Tape Ball Bat", "Cricket Kit"]),
    S("Football", "football", ["Football", "Football Boots", "Goalkeeper Gloves"]),
    S("Badminton", "badminton", ["Badminton Racket", "Shuttlecocks", "Racket Bag"]),
    S("Cycling", "bicycle", ["Mountain Bike", "Cycling Helmet", "Bike Light"]),
    S("Yoga Equipment", "yoga", ["Yoga Mat", "Yoga Block", "Foam Roller"]),
  ]),
  C("Toys & Baby", "🧸", [
    S("Educational Toys", "toys", ["STEM Kit", "Puzzle", "Learning Tablet"]),
    S("Remote Control Toys", "rccar", ["RC Car", "Drone", "RC Truck"]),
    S("Building Blocks", "lego", ["Building Blocks", "Brick Set", "Magnetic Tiles"]),
    S("Board Games", "boardgame", ["Ludo", "Chess Set", "Carrom Board"]),
    S("Baby Care", "baby", ["Baby Diapers", "Baby Wipes", "Baby Lotion"]),
    S("Strollers", "stroller", ["Baby Stroller", "Pram", "Travel System"]),
  ]),
  C("Computers & Tech", "💻", [
    S("Laptops", "laptop", ["Laptop", "Gaming Laptop", "Ultrabook"]),
    S("Monitors", "monitor", ["IPS Monitor", "Gaming Monitor", "Curved Monitor"]),
    S("Keyboards", "keyboard", ["Mechanical Keyboard", "Wireless Keyboard", "Combo"]),
    S("Mouse", "computermouse", ["Gaming Mouse", "Wireless Mouse", "Ergonomic Mouse"]),
    S("Storage Devices", "harddrive", ["SSD", "USB Flash Drive", "External HDD"]),
    S("Printers", "printer", ["Inkjet Printer", "Laser Printer", "Photo Printer"]),
  ]),
  C("Automotive", "🚗", [
    S("Car Accessories", "caraccessories", ["Car Seat Cover", "Steering Cover", "Floor Mats"]),
    S("Car Electronics", "dashcam", ["Dash Cam", "Car Charger", "Android Car Stereo"]),
    S("Helmets", "helmet", ["Full Face Helmet", "Half Helmet", "Kids Helmet"]),
    S("Car Cleaning", "carwash", ["Car Shampoo", "Microfiber Cloth", "Car Polish"]),
  ]),
  C("Books & Stationery", "📚", [
    S("Novels", "novel", ["Novel", "Urdu Novel", "Thriller"]),
    S("Islamic Books", "quran", ["Quran Majeed", "Hadith Collection", "Seerah Book"]),
    S("Children's Books", "childrenbook", ["Story Book", "Coloring Book", "Activity Book"]),
    S("Notebooks", "notebook", ["Spiral Notebook", "Hardcover Diary", "Planner"]),
    S("School Bags", "backpack", ["School Bag", "Laptop Backpack", "Kids Backpack"]),
  ]),
  C("More Categories", "🎁", [
    S("Pet Supplies", "pet", ["Cat Food", "Dog Leash", "Pet Bed"]),
    S("Luggage & Bags", "luggage", ["Trolley Bag", "Duffel Bag", "Travel Organizer"]),
    S("Musical Instruments", "guitar", ["Acoustic Guitar", "Keyboard Piano", "Ukulele"]),
    S("Garden & Outdoor", "garden", ["Plant Pot", "Garden Tools", "Outdoor Chair"]),
    S("Gifts & Occasions", "gift", ["Gift Hamper", "Gift Box", "Eid Gift Set"]),
  ]),
];

export const brands = [
  "Zenvo",
  "Kairo",
  "Nuvella",
  "Orbix",
  "Lumora",
  "Tazaa",
  "Saffra",
  "Vortiq",
  "Hilal",
  "Aeron",
  "Mirza & Co",
  "Qubra",
  "Nexa",
  "Rivaa",
  "Urbano",
  "Pakwear",
];
const adjectives = [
  "Classic",
  "Ultra",
  "Prime",
  "Signature",
  "Eco",
  "Max",
  "Air",
  "Royal",
  "Smart",
  "Pro",
  "Essential",
  "Deluxe",
  "Neo",
  "Elite",
  "Fresh",
  "Studio",
  "Nova",
  "Velvet",
  "Spark",
  "Urban",
  "Comfort",
  "Titan",
  "Pure",
  "Edge",
];
const colorsAll = [
  "Black",
  "White",
  "Navy",
  "Orange",
  "Grey",
  "Maroon",
  "Olive",
  "Beige",
  "Sky Blue",
];
const fashionCats = ["mens-fashion", "womens-fashion", "shoes-and-watches"];

const pools = imagePools as Record<string, string[]>;
const poolFor: Record<string, string> = {
  smartphone: "smartphones",
  tablet: "tablets",
  smartwatch: "mens-watches",
  headphones: "mobile-accessories",
  powerbank: "mobile-accessories",
  speaker: "mobile-accessories",
  camera: "mobile-accessories",
  television: "laptops",
  gameconsole: "mobile-accessories",
  tshirt: "mens-shirts",
  shirt: "mens-shirts",
  jeans: "mens-shirts",
  hoodie: "mens-shirts",
  jacket: "mens-shirts",
  kurta: "mens-shirts",
  dress: "womens-dresses",
  kurti: "tops",
  salwar: "womens-dresses",
  hijab: "tops",
  handbag: "womens-bags",
  jewelry: "womens-jewellery",
  sneakers: "mens-shoes",
  oxfordshoes: "mens-shoes",
  sandals: "womens-shoes",
  wristwatch: "mens-watches",
  womenwatch: "womens-watches",
  makeup: "beauty",
  skincare: "skin-care",
  perfume: "fragrances",
  shampoo: "skin-care",
  beardtrimmer: "skin-care",
  furniture: "furniture",
  homedecor: "home-decoration",
  lamp: "home-decoration",
  blender: "kitchen-accessories",
  cookware: "kitchen-accessories",
  bedding: "furniture",
  rice: "groceries",
  snacks: "groceries",
  chocolate: "groceries",
  tea: "groceries",
  juice: "groceries",
  dumbbell: "sports-accessories",
  cricket: "sports-accessories",
  football: "sports-accessories",
  badminton: "sports-accessories",
  bicycle: "sports-accessories",
  yoga: "sports-accessories",
  toys: "sports-accessories",
  rccar: "vehicle",
  lego: "home-decoration",
  boardgame: "home-decoration",
  baby: "skin-care",
  stroller: "furniture",
  laptop: "laptops",
  monitor: "laptops",
  keyboard: "laptops",
  computermouse: "mobile-accessories",
  harddrive: "mobile-accessories",
  printer: "laptops",
  caraccessories: "vehicle",
  dashcam: "vehicle",
  helmet: "motorcycle",
  carwash: "vehicle",
  novel: "home-decoration",
  quran: "home-decoration",
  childrenbook: "home-decoration",
  notebook: "home-decoration",
  backpack: "womens-bags",
  pet: "groceries",
  luggage: "womens-bags",
  guitar: "home-decoration",
  garden: "home-decoration",
  gift: "fragrances",
};
function rng(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function build(): Product[] {
  const out: Product[] = [];
  let n = 1;
  for (const c of categories)
    for (const s of c.subs)
      for (let i = 0; i < 24; i++) {
        const r = rng(n * 7919);
        const noun = s.nouns[i % s.nouns.length]!;
        const adj = adjectives[(i * 5 + n) % adjectives.length]!;
        const brand = brands[Math.floor(r() * brands.length)]!;
        const model =
          i < 12
            ? ""
            : ` ${["X", "S", "Plus", "Mini", "2", "Go", "Lite", "Max", "Neo", "3", "One", "Air"][i - 12]}`;
        const name = `${brand} ${adj} ${noun}${model}`;
        const base =
          c.slug === "grocery-and-food"
            ? 200 + r() * 2500
            : c.slug.includes("computer") || s.slug === "televisions" || s.slug === "laptops"
              ? 15000 + r() * 250000
              : 600 + r() * 18000;
        const discount = r() < 0.75 ? Math.floor(5 + r() * 55) : 0;
        const oldPrice = Math.round(base / 10) * 10 - 1;
        const price = Math.round((oldPrice * (100 - discount)) / 100);
        const kw = s.kw;
        out.push({
          id: String(n),
          slug: `${slugify(name)}-${n}`,
          name,
          brand,
          category: c.slug,
          categoryName: c.name,
          sub: s.slug,
          subName: s.name,
          price,
          oldPrice,
          discount,
          rating: Math.round((3.4 + r() * 1.6) * 10) / 10,
          reviews: Math.floor(r() * 2400),
          stock: r() < 0.08 ? 0 : Math.floor(r() * 120) + 1,
          sold: Math.floor(r() * 9000),
          isNew: r() < 0.2,
          addedDaysAgo: Math.floor(r() * 90),
          images: [0, 1, 2, 3].map((k) => {
            const pool = pools[poolFor[kw] ?? "groceries"] ?? [];
            return pool[(i * 3 + k * 7 + n) % pool.length] ?? "";
          }),
          description: `The ${name} is crafted by ${brand} for everyday reliability and style. A top pick in ${s.name}, it combines quality materials, thoughtful design and great value — delivered fast anywhere in Pakistan.`,
          colors: colorsAll.slice(n % 5, (n % 5) + 3),
          sizes: fashionCats.includes(c.slug)
            ? c.slug === "shoes-and-watches" && !s.slug.includes("watch")
              ? ["39", "40", "41", "42", "43", "44"]
              : s.slug.includes("watch") || ["handbags", "jewellery"].includes(s.slug)
                ? []
                : ["S", "M", "L", "XL", "XXL"]
            : [],
        });
        n++;
      }
  return out;
}

export const products = build();
export const bySlug = new Map(products.map((p) => [p.slug, p]));
export const findCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const pkr = (n: number) => "Rs. " + n.toLocaleString("en-PK");
export const pick = (list: Product[], seed: number, count: number) => {
  const r = rng(seed);
  return [...list].sort(() => r() - 0.5).slice(0, count);
};
export const bestSellers = [...products].sort((a, b) => b.sold - a.sold);
export const newArrivals = products
  .filter((p) => p.isNew)
  .sort((a, b) => a.addedDaysAgo - b.addedDaysAgo);
export const deals = products
  .filter((p) => p.discount >= 30)
  .sort((a, b) => b.discount - a.discount);
export const flashSale = products.filter((p) => p.discount >= 45 && p.stock > 0);

export type SortKey = "recommended" | "newest" | "price-asc" | "price-desc" | "popular" | "rating";
export function sortProducts(list: Product[], sort: SortKey) {
  const l = [...list];
  switch (sort) {
    case "newest":
      return l.sort((a, b) => a.addedDaysAgo - b.addedDaysAgo);
    case "price-asc":
      return l.sort((a, b) => a.price - b.price);
    case "price-desc":
      return l.sort((a, b) => b.price - a.price);
    case "popular":
      return l.sort((a, b) => b.sold - a.sold);
    case "rating":
      return l.sort((a, b) => b.rating - a.rating);
    default:
      return l;
  }
}
export function searchProducts(q: string) {
  const t = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!t.length) return [];
  return products.filter((p) => {
    const h = `${p.name} ${p.brand} ${p.categoryName} ${p.subName}`.toLowerCase();
    return t.every((w) => h.includes(w));
  });
}
