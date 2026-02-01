import { Character, Category } from "@/types";

export type { Character, Category };

export const characters: Character[] = [
  { 
    id: "1", 
    name: "Kaizen", 
    age: 24, 
    country: "Brasil", 
    hair: "Dark brown, wavy, shoulder-length",
    eyes: "Deep brown, almond-shaped",
    style: "Casual chic, earth tones",
    desc: "Energetic and bold, perfect for lifestyle content", 
    isPremium: false,
    rules: ["Natural lighting preferred", "Warm color palette", "Authentic expressions"]
  },
  { 
    id: "2", 
    name: "Aiko", 
    age: 22, 
    country: "Japão", 
    hair: "Straight black, long with bangs",
    eyes: "Dark brown, soft gaze",
    style: "Minimalist Japanese aesthetic",
    desc: "Elegant and serene with delicate features", 
    isPremium: false,
    rules: ["Soft diffused light", "Clean backgrounds", "Subtle expressions"]
  },
  { 
    id: "3", 
    name: "Luna", 
    age: 26, 
    country: "Espanha", 
    hair: "Dark auburn, thick curls",
    eyes: "Hazel with golden flecks",
    style: "Mediterranean bohemian",
    desc: "Passionate and expressive Mediterranean beauty", 
    isPremium: false,
    rules: ["Golden hour lighting", "Warm tones", "Expressive poses"]
  },
  { 
    id: "4", 
    name: "Maya", 
    age: 25, 
    country: "Índia", 
    hair: "Jet black, long and silky",
    eyes: "Dark brown, intense",
    style: "Traditional meets modern",
    desc: "Graceful with striking traditional aesthetics", 
    isPremium: false,
    rules: ["Rich jewel tones", "Ornate details welcome", "Regal posture"]
  },
  { 
    id: "5", 
    name: "Sofia", 
    age: 23, 
    country: "Itália", 
    hair: "Chestnut brown, loose waves",
    eyes: "Green-gray, expressive",
    style: "Italian elegance",
    desc: "Classic beauty with modern flair", 
    isPremium: false,
    rules: ["Natural beauty emphasis", "Effortless style", "Confident expressions"]
  },
  { 
    id: "6", 
    name: "Irina", 
    age: 28, 
    country: "Rússia", 
    hair: "Platinum blonde, sleek",
    eyes: "Ice blue, piercing",
    style: "High fashion editorial",
    desc: "Sophisticated and mysterious allure", 
    isPremium: true,
    rules: ["Dramatic lighting", "Cool color palette", "Strong angular poses"]
  },
  { 
    id: "7", 
    name: "Yara", 
    age: 27, 
    country: "Líbano", 
    hair: "Dark brown, voluminous",
    eyes: "Deep green, captivating",
    style: "Middle Eastern glamour",
    desc: "Exotic beauty with captivating eyes", 
    isPremium: true,
    rules: ["Gold accents welcome", "Smoky eye makeup", "Luxurious settings"]
  },
  { 
    id: "8", 
    name: "Helena", 
    age: 35, 
    country: "Alemanha", 
    hair: "Ash blonde, bob cut",
    eyes: "Steel gray, confident",
    style: "Sophisticated minimalist",
    desc: "Mature elegance and refined style", 
    isPremium: true,
    rules: ["Clean lines", "Neutral palette", "Professional settings"]
  },
  { 
    id: "9", 
    name: "Camila", 
    age: 32, 
    country: "Colômbia", 
    hair: "Dark brown, long layers",
    eyes: "Warm brown, friendly",
    style: "Vibrant and colorful",
    desc: "Vibrant and full of life energy", 
    isPremium: true,
    rules: ["Bold colors welcome", "Dynamic poses", "Joyful expressions"]
  },
  { 
    id: "10", 
    name: "Nina", 
    age: 41, 
    country: "França", 
    hair: "Salt and pepper, chic bob",
    eyes: "Brown, wise",
    style: "Parisian sophistication",
    desc: "Timeless Parisian sophistication", 
    isPremium: true,
    rules: ["Classic French aesthetic", "Understated elegance", "Confident presence"]
  },
  { 
    id: "11", 
    name: "Akemi", 
    age: 50, 
    country: "Japão", 
    hair: "Silver-streaked black, elegant updo",
    eyes: "Dark brown, serene",
    style: "Traditional Japanese elegance",
    desc: "Ageless beauty with wisdom", 
    isPremium: true,
    rules: ["Graceful poses", "Traditional elements", "Serene expressions"]
  },
  { 
    id: "12", 
    name: "Rosa", 
    age: 48, 
    country: "Bolívia", 
    hair: "Gray-streaked brown, natural",
    eyes: "Warm brown, nurturing",
    style: "Earth mother aesthetic",
    desc: "Warm and nurturing presence", 
    isPremium: true,
    rules: ["Natural textures", "Earthy colors", "Genuine warmth"]
  },
  { 
    id: "13", 
    name: "Tatiana", 
    age: 45, 
    country: "Rússia", 
    hair: "Dark red, sophisticated style",
    eyes: "Gray-green, commanding",
    style: "Power elegance",
    desc: "Commanding presence with grace", 
    isPremium: true,
    rules: ["Strong silhouettes", "Rich colors", "Authoritative poses"]
  },
  { 
    id: "14", 
    name: "Liu", 
    age: 38, 
    country: "China", 
    hair: "Black, sleek and shiny",
    eyes: "Dark brown, mysterious",
    style: "Modern Asian fusion",
    desc: "Ethereal and poised beauty", 
    isPremium: true,
    rules: ["Soft lighting", "Flowing fabrics", "Graceful movements"]
  },
  { 
    id: "15", 
    name: "Amara", 
    age: 42, 
    country: "Nigéria", 
    hair: "Natural coils, regal crown",
    eyes: "Deep brown, powerful",
    style: "African queen aesthetic",
    desc: "Radiant queen with powerful aura", 
    isPremium: true,
    rules: ["Bold patterns", "Vibrant colors", "Regal presence"]
  },
];

export const locations = [
  "Bedroom",
  "Bathroom", 
  "Luxury car interior",
  "Hotel room",
  "Motel room",
  "Kitchen",
  "Living room",
  "Rooftop terrace",
  "Beach sunset",
  "Coffee shop",
  "Street fashion",
  "Mirror reflection",
];

export const outfits = [
  "Skims lounge set",
  "Adidas Originals athleisure",
  "Nike Pro sportswear",
  "Zara Studio outfit",
  "Balenciaga streetwear",
  "Victoria's Secret loungewear",
  "Casual denim and white tee",
  "Elegant evening dress",
  "Business casual",
  "Cozy home attire",
];

export const cameraStyles = [
  "Smartphone selfie",
  "Mirror selfie",
  "Professional DSLR",
  "Candid lifestyle",
  "Ring light portrait",
  "Golden hour natural",
  "Studio lighting",
  "Natural window light",
];

export const emotions = [
  "Soft smile",
  "Laughing",
  "Serious confident look",
  "Relaxed casual",
  "Sensual subtle",
  "Playful wink",
  "Dreamy gaze",
  "Mysterious",
  "Joyful",
];

export const artStyles = [
  "Ultra-realistic",
  "Anime",
  "Anime realistic (hybrid)",
  "Cinematic film look",
  "Editorial fashion",
  "Documentary style",
  "Fine art portrait",
];

export const categories: Category[] = [
  'All',
  'Selfie',
  'Bathroom',
  'Bedroom',
  'Kitchen',
  'Street',
  'Beauty',
  'Lifestyle',
  'Mirror',
  'Mood',
  'Car',
];

export const readyPrompts = [
  {
    title: "Cozy Morning",
    prompt: "Ultra-photorealistic image of Kaizen, 24, Brazilian, in a modern bedroom, smartphone selfie, soft smile, Skims lounge set, natural skin texture, morning golden light, UGC realism, 8K quality.",
  },
  {
    title: "Urban Lifestyle",
    prompt: "Hyper-realistic candid shot of Luna, 26, Spanish, in a trendy coffee shop, professional DSLR quality, laughing, casual denim and white tee, natural bokeh background, lifestyle influencer aesthetic.",
  },
  {
    title: "Elegant Evening",
    prompt: "Cinematic portrait of Sofia, 23, Italian, in a luxury hotel room, ring light portrait, serious confident look, elegant evening dress, soft shadows, fashion editorial style.",
  },
  {
    title: "Fitness Vibes",
    prompt: "Dynamic shot of Maya, 25, Indian, in a bright living room, mirror selfie, relaxed casual expression, Nike Pro sportswear, energetic pose, fitness influencer aesthetic.",
  },
];
