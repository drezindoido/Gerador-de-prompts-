export interface Character {
  id: string;
  name: string;
  age: number;
  country: string;
  isPremium: boolean;
  description: string;
}

export const characters: Character[] = [
  { id: "1", name: "Kaizen", age: 24, country: "Brasil", isPremium: false, description: "Energetic and bold, perfect for lifestyle content" },
  { id: "2", name: "Aiko", age: 22, country: "Japão", isPremium: false, description: "Elegant and serene with delicate features" },
  { id: "3", name: "Luna", age: 26, country: "Espanha", isPremium: false, description: "Passionate and expressive Mediterranean beauty" },
  { id: "4", name: "Maya", age: 25, country: "Índia", isPremium: false, description: "Graceful with striking traditional aesthetics" },
  { id: "5", name: "Sofia", age: 23, country: "Itália", isPremium: false, description: "Classic beauty with modern flair" },
  { id: "6", name: "Irina", age: 28, country: "Rússia", isPremium: true, description: "Sophisticated and mysterious allure" },
  { id: "7", name: "Yara", age: 27, country: "Líbano", isPremium: true, description: "Exotic beauty with captivating eyes" },
  { id: "8", name: "Helena", age: 35, country: "Alemanha", isPremium: true, description: "Mature elegance and refined style" },
  { id: "9", name: "Camila", age: 32, country: "Colômbia", isPremium: true, description: "Vibrant and full of life energy" },
  { id: "10", name: "Nina", age: 41, country: "França", isPremium: true, description: "Timeless Parisian sophistication" },
  { id: "11", name: "Akemi", age: 50, country: "Japão", isPremium: true, description: "Ageless beauty with wisdom" },
  { id: "12", name: "Rosa", age: 48, country: "Bolívia", isPremium: true, description: "Warm and nurturing presence" },
  { id: "13", name: "Tatiana", age: 45, country: "Rússia", isPremium: true, description: "Commanding presence with grace" },
  { id: "14", name: "Liu", age: 38, country: "China", isPremium: true, description: "Ethereal and poised beauty" },
  { id: "15", name: "Amara", age: 42, country: "Nigéria", isPremium: true, description: "Radiant queen with powerful aura" },
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
];

export const cameraStyles = [
  "Smartphone selfie",
  "Mirror selfie",
  "Professional DSLR",
  "Candid lifestyle",
  "Ring light portrait",
  "Golden hour natural",
];

export const emotions = [
  "Soft smile",
  "Laughing",
  "Serious confident look",
  "Relaxed casual",
  "Sensual subtle",
  "Playful wink",
  "Dreamy gaze",
];

export const artStyles = [
  "Ultra-realistic",
  "Anime",
  "Anime realistic (hybrid)",
  "Cinematic film look",
  "Editorial fashion",
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
