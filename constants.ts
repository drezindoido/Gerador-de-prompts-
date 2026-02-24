
import { Character, CameraCategory } from './types';

export const LOCATIONS = [
  "Nenhum (Manter original)",
  "Banheiro minimalista moderno com acabamento em mármore",
  "Quarto principal ensolarado, cama bagunçada",
  "Interior de SUV de luxo, luzes da cidade à noite",
  "Esquina urbana movimentada, sinais de neon ao fundo",
  "Cozinha moderna elegante, aço inoxidável",
  "Elevador de alto padrão com paredes de metal escovado",
  "Varanda externa nublada, horizonte da cidade ao fundo",
  "Escritório doméstico minimalista, mesa com laptop",
  "Cafeteria boutique com iluminação quente",
  "Lounge de aeroporto executivo",
  "Beira da piscina em resort de luxo",
  "Galeria de arte contemporânea, paredes brancas",
  "Rua chuvosa de Tóquio à noite",
  "Camarim iluminado com espelhos infinitos",
  "Terraço cobertura durante a golden hour",
  "Academia de luxo com espelhos do chão ao teto",
  "Iate privado em alto mar, pôr do sol",
  "Loft industrial com tijolos expostos",
  "Jardim de inverno com vidro e plantas tropicais",
  "Supermercado gourmet à noite, luzes fluorescentes suaves",
  "Estacionamento subterrâneo vazio, estética liminar",
  "Quadra de tênis particular, luz do meio-dia",
  "Beach club em Mykonos, areia branca e azul",
  "Interior de jato privado (Gulfstream), cabine luxo",
  "Backstage de desfile de moda, caos organizado",
  "Terraço em Santorini, cúpulas azuis ao fundo",
  "Campo de lavanda na Provence, luz suave",
  "Livraria de dois andares com escadas caracol",
  "Piano bar sofisticado, luz vermelha suave",
  "Sala de cinema privada, poltronas de couro",
  "Pista de boliche retrô, estética anos 80",
  "Telhado de Nova York com vista para o Empire State",
  "Vilarejo de neve nos Alpes Suíços",
  "Deserto de Dubai, dunas infinitas ao amanhecer",
  "Spa de luxo com pedras vulcânicas e vapor",
  "Loja de grife na Quinta Avenida"
];

export const CAMERA_DATABASE: CameraCategory[] = [
  {
    category: "Smartphones",
    items: [
      "iPhone 16 Pro Max, lente principal 24mm, Photonic Engine",
      "Samsung Galaxy S26 Ultra, 200MP, Super Resolução",
      "Google Pixel 9 Pro, HDR+ Avançado, Real Tone",
      "Xiaomi 15 Ultra, Óptica Leica, Sensor de 1 polegada",
      "Sony Xperia 1 VI, Óptica Zeiss, App Cinema Pro",
      "iPhone 15 Pro, Iluminação de Retrato Estúdio, 35mm"
    ]
  },
  {
    category: "Mirrorless e Cinema",
    items: [
      "Sony A1 II, 50mm f/1.2 GM, Nitidez de Estúdio",
      "Canon EOS R6 Mark III, 85mm f/1.2, Tons de Pele Perfeitos",
      "Nikon Z6 III, 35mm f/1.8 S, Estilo Urbano",
      "Arri Alexa 35, Lentes Signature, Visual Hollywood",
      "RED V-Raptor XL, 8K, Anamórfica com Flares",
      "Fujifilm X-100VI, Simulação Reala Ace, 23mm Fixa",
      "Leica Q3, 28mm Summilux, Detalhe Macro"
    ]
  },
  {
    category: "Analógicas e Vintage",
    items: [
      "Kodak Portra 400, Canon AE-1, Grão Quente",
      "CineStill 800T, Nikon F3, Estética Neon Azul/Laranja",
      "Polaroid 600, Filme Instantâneo, Foco Suave",
      "Fujifilm Superia 400, Pentax K1000, Verde Vintage",
      "Contax T2, Carl Zeiss, Estética de Flash Direto"
    ]
  }
];

export const OUTFITS = [
  "Manter original (Nenhum)",
  "Conjunto lounge Skims (Adaptável ao gênero)", 
  "Camiseta branca oversized e calça larga", 
  "Leggings/Bermuda Nike Pro compressão", 
  "Vestido slip de seda / Camisa de seda elegante", 
  "Conjunto Lululemon Yoga / Athleisure masculino", 
  "Jeans vintage e regata branca", 
  "Roupão de banho de hotel felpudo", 
  "Blazer oversized moderno e alfaiataria", 
  "Jaqueta de couro vegano e jeans preto", 
  "Moletom Essentials Fear of God", 
  "Biquíni minimalista / Calção de banho luxo",
  "Trench coat Burberry clássico", 
  "Camisa social branca premium aberta", 
  "Jaqueta Puffer North Face e Gorro", 
  "Traje de gala / Vestido de festa", 
  "Techwear futurista urbano All-Black", 
  "Visual Old Money: suéter nos ombros e polo",
  "Streetwear: Camisa de time de futebol e correntes",
  "Visual Casual: Camiseta Henley e calça chino"
];

export const LIGHTING = [
  "HORA DOURADA: luz solar quente e baixa do pôr do sol",
  "LUZ DE CONTORNO: contraluz forte, definição de borda luminosa",
  "LUZ NATURAL: luz do dia suave e difusa vinda da janela",
  "CLARO-ESCURO: queda de luz dramática, sombras profundas",
  "PUNCH NEON: iluminação de rua colorida e intensa",
  "SOFTBOX: luz de estúdio profissional envolvente",
  "FLASH DIRETO: flash de festa amador de smartphone"
];

export const EXPRESSIONS = [
  "PENSATIVA: pensive expression, deep in thought, head tilted",
  "SURPRESA: wide eyes, mouth slightly open, amazed shock",
  "IRRITADA: furrowed brows, lips pressed together, impatient vibe",
  "SORRISO DE CANTO: confident knowing look, asymmetrical smile",
  "BIQUINHO: playful intensity, lips pushed forward",
  "OLHAR SEDUTOR: piercing intense gaze, seductive eyes",
  "SORRISO GENUÍNO: genuine authentic happy smile, eyes crinkling",
  "OLHOS DE BAMBI: wide innocent gaze",
  "TRAVESSA: playful face, slight tongue out",
  "RINDO: mid-action genuine laughter, head back",
  "PISCANDO: one eye closed, charming and playful smirk",
  "SERENA: eyes closed, peaceful and calm expression",
  "ENTEDIADA: half-lidded eyes, chin resting on hand",
  "ORGULHOSA: head held high, subtle triumphant smile",
  "CÉTICA: one eyebrow raised, lips pursed",
  "MELANCÓLICA: distant pensive gaze, soft sad eyes"
];

export const BRANDS = [
  { name: "Nenhuma", prompt: "" },
  { name: "Nike", prompt: "wearing a high-quality Nike branding with visible logo embroidery" },
  { name: "Adidas", prompt: "wearing classic Adidas Originals three-stripes branding" },
  { name: "Prada", prompt: "wearing premium Prada branding and luxury finish" },
  { name: "Gucci", prompt: "wearing high-fashion Gucci aesthetic and branding" },
  { name: "Louis Vuitton", prompt: "wearing luxury Louis Vuitton monogram details" }
];

export const CELEBRITIES = [
  "Nenhum",
  "Taylor Swift",
  "Beyoncé",
  "Rihanna",
  "Ariana Grande",
  "Drake",
  "Justin Bieber",
  "Lady Gaga",
  "The Weeknd",
  "Billie Eilish",
  "Zendaya",
  "Neymar Jr",
  "Cristiano Ronaldo",
  "Lionel Messi",
  "LeBron James",
  "Lewis Hamilton",
  "Kim Kardashian",
  "Kylie Jenner",
  "Selena Gomez",
  "MrBeast",
  "Virginia Fonseca",
  "Elon Musk"
];

export const CHARACTERS: Character[] = [
  {
    id: "kaizen",
    name: "Kaizen",
    age: 24,
    country: "Brasil",
    hair: "Lilás claro / roxo pastel",
    eyes: "Verdes",
    style: "UGC Ultra-realista",
    desc: "Cabelo lilás característico, influenciadora brasileira, pele com poros visíveis.",
    isPremium: false,
    rules: ["Cabelo lilás claro - inegociável", "Poros reais e micro-imperfeições", "Sem filtros de beleza suavizados"]
  },
  {
    id: "aiko",
    name: "Aiko",
    age: 22,
    country: "Japão",
    hair: "Preto liso com franja",
    eyes: "Castanhos",
    style: "Minimalista Suave",
    desc: "Traços suaves, estética minimalista japonesa.",
    isPremium: false,
    rules: ["Cabelo preto liso com franja", "Iluminação suave", "Minimalismo"]
  }
];
