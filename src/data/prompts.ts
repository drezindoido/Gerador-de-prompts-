import { Prompt, Character } from '@/types';

// --- LOCATIONS ---
export const LOCATIONS = [
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
  "Biblioteca antiga com acabamento em madeira escura",
  "Iate privado em alto mar, pôr do sol",
  "Loft industrial com tijolos expostos",
  "Jardim de inverno com vidro e plantas tropicais"
];

// --- EXTENSIVE CAMERA DATABASE (100+ ITEMS) ---
export const CAMERA_DATABASE = [
  {
    category: "Smartphones Top Tier (Computacional)",
    items: [
      "iPhone 16 Pro Max, 24mm Main, Photonic Engine",
      "Samsung Galaxy S26 Ultra, 200MP, Super Resolution",
      "Google Pixel 9 Pro, HDR+ Enhanced, Real Tone",
      "Huawei Pura 80 Ultra, XMAGE, Vivid Color",
      "Xiaomi 15 Ultra, Leica Optics, 1-inch Sensor",
      "Oppo Find X9 Pro, Hasselblad Color Calibration",
      "Honor Magic 6 Pro, Falcon Camera, Fast Capture",
      "Vivo X100 Pro, Zeiss T* Coating, Portrait Mode",
      "Sony Xperia 1 VI, Zeiss Optics, Cinema Pro App",
      "Samsung Galaxy Z Fold7, Flex Mode, Nightography",
      "OnePlus 13 Pro, Hasselblad 4th Gen, Natural Color",
      "iPhone 15 Pro, Portrait Lighting Studio, 35mm",
      "Google Pixel 8a, Computational Bokeh, Magic Eraser Style",
      "Motorola Edge 50 Ultra, Pantone Validated Colors",
      "Nothing Phone (3), Glyph Lighting Fill, Raw Style"
    ]
  },
  {
    category: "Mirrorless Full Frame (Profissional)",
    items: [
      "Sony A1 II, 50mm f/1.2 GM, Studio Sharpness",
      "Canon EOS R6 Mark III, 85mm f/1.2, Perfect Skin Tones",
      "Nikon Z6 III, 35mm f/1.8 S, Street Documentary Look",
      "Sony A7R V, 135mm GM, Compression Bokeh",
      "Canon EOS R3, 24-70mm Zoom, Sports/Lifestyle",
      "Nikon Z8, 50mm f/1.8, High Res Fashion",
      "Panasonic Lumix S5IIX, V-Log Profile, Cinematic Video Look",
      "Leica SL3, Summicron-SL 50mm, Fine Art Contrast",
      "Sony ZV-E1, Cinematic Vlog Style, S-Cinetone",
      "Canon EOS R5, 100mm Macro, Beauty Detail",
      "Nikon Zf, 40mm SE, Retro Body Modern Sensor",
      "Sigma fp L, Teal and Orange Cinema Look",
      "Sony A7C II, Compact Full Frame, Travel Style"
    ]
  },
  {
    category: "Mirrorless APS-C & MFT (Ágil/Vlog)",
    items: [
      "Fujifilm X-T5, 35mm f/1.4, Classic Chrome Simulation",
      "Sony A6700, Sigma 30mm f/1.4, Sharp Digital Look",
      "Canon EOS R7, RF-S 18-150mm, Wildlife/Action",
      "Nikon Zfc, Vintage Lens 28mm, Retro Aesthetic",
      "Fujifilm X-H2S, Eterna Cinema Profile, Soft Color",
      "OM System OM-1 Mark II, 12-40mm Pro, Nature HDR",
      "Panasonic Lumix GH7, Anamorphic Lens, Indie Movie",
      "Sony ZV-E10 II, Kit Lens, Youtuber Aesthetic",
      "Fujifilm X-S20, Nostalgic Neg Film Sim",
      "Canon EOS R50, Vertical Video Style, Social Media Ready"
    ]
  },
  {
    category: "Médio Formato (High-End Editorial)",
    items: [
      "Fujifilm GFX 100 II, 110mm f/2, Extreme Resolution",
      "Hasselblad X2D 100C, 65mm XCD, Natural Color Solution",
      "Phase One XF IQ4, 150MP, Commercial Advertising Look",
      "Leica S3, 70mm Summarit-S, Editorial Fashion",
      "Pentax 645Z, 55mm, Deep Depth of Field",
      "Fujifilm GFX 50S II, 45mm, Soft Medium Format Look",
      "Hasselblad 907X, Vintage Waist Level Finder Style"
    ]
  },
  {
    category: "Câmeras Compactas Premium (Street/Vibe)",
    items: [
      "Ricoh GR IIIx, High Contrast B&W, Street Snap",
      "Fujifilm X100VI, Reala Ace Sim, 23mm Fixed",
      "Sony RX100 VII, Zeiss Pop, Sharp Compact",
      "Leica Q3, 28mm Summilux, Architectural Symmetry",
      "Canon PowerShot G7 X Mark III, Direct Flash, Y2K Vibe",
      "Sony ZV-1 II, Wide Angle Vlog, Product Showcase",
      "Panasonic Lumix LX100 II, Leica Lens, Monochrome",
      "Olympus Pen-F, Grainy Film Art Filter",
      "Zeiss ZX1, Distagon 35mm, Minimalist Edit",
      "Kodak PixPro, Low Res CCD Aesthetic, 2000s Nostalgia"
    ]
  },
  {
    category: "Filme Analógico 35mm (Nostalgia)",
    items: [
      "Canon AE-1 Program, Kodak Portra 400, Warm Tones",
      "Leica M6, Ilford HP5 Plus, Gritty B&W",
      "Contax T2, Carl Zeiss Sonnar, Direct Flash Fashion",
      "Olympus MJU II, Kodak Gold 200, Vignette Style",
      "Nikon F3, CineStill 800T, Halation Neon Effect",
      "Yashica T4, Terry Richardson Style, Hard Flash",
      "Pentax K1000, Fujifilm Superia 400, Green Cast",
      "Rollei 35S, Kodak Ektar 100, Vivid Saturation",
      "Minolta X-700, Agfa Vista 200, Vintage Red Tones",
      "Canon Sure Shot, Expired Film, Color Shifts"
    ]
  },
  {
    category: "Cinema & Vídeo Profissional",
    items: [
      "Arri Alexa 35, Signature Primes, Hollywood Look",
      "RED V-Raptor XL, 8K Vista Vision, Anamorphic Flares",
      "Sony Venice 2, Full Frame Cinema, High Dynamic Range",
      "Blackmagic Cinema Camera 6K, Vintage Lens Bloom",
      "IMAX 70mm Film, Massive Depth, Hyper-Realism",
      "Panavision Millennium DXL2, Light Iron Color",
      "Canon C500 Mark II, Raw Light, Documentary Style",
      "16mm Bolex H16, Kodak Vision3 500T, Grainy Retro",
      "Super 8mm Braun Nizo, Ektachrome, Home Movie Vibe",
      "GoPro HERO 13 Black, HyperSmooth, Wide Action",
      "DJI Osmo Pocket 3, 1-inch CMOS, Smooth Gimbal"
    ]
  },
  {
    category: "Conceitual & Artístico",
    items: [
      "Polaroid 600, Instant Film, Soft Focus & Border",
      "Instax Mini Evo, Hybrid Digital-Analog, Leaking Light",
      "Holga 120N, Lo-Fi, Plastic Lens Aberrations",
      "Lomo LC-A+, Heavy Vignette, Cross Processed",
      "Game Boy Camera, 2-bit Pixel Art, Dithering",
      "Thermal Camera FLIR, Heat Map Color Palette",
      "Night Vision Goggles, Green Phosphor Grain",
      "CCTV Security Camera, Low Bitrate, Timestamp Overlay",
      "Drone DJI Mavic 3 Pro, Hasselblad Aerial, Top-Down"
    ]
  }
];

// --- NOVO: BANCO DE ILUMINAÇÃO ---
export const LIGHTING_DATABASE = [
  "GOLDEN HOUR: warm low-angle sunset sunlight, soft specular highlights, natural light wrap",
  "RIM LIGHTING: strong backlight creating luminous edge definition, pronounced separation",
  "NATURAL LIGHT: soft diffused window daylight, smooth tonal transitions, professionals lifestyle look",
  "CHIAROSCURO: dramatic light falloff, strong directional key light, deep cinematic shadows"
];

// --- NOVO: BANCO DE EXPRESSÕES & SORRISOS ---
export const EXPRESSIONS_DATABASE = [
  "SMIRK: asymmetrical smile with one corner raised, confident knowing expression",
  "SUBTLE: Mona Lisa style mysterious barely-there smile, calm and serene",
  "COY: shy demure flirtatious smile, looking up through lashes",
  "DUCHENNE: genuine authentic happy smile involving mouth and eyes",
  "PROFESSIONAL: classic corporate photoshoot smile, controlled and elegant",
  "MISCHIEVOUS: playful impish grin, teasing expression",
  "SNEER: contemptuous upper lip curl, judgmental look",
  "SMOLDER: intense seductive gaze, piercing confident stare",
  "POUT: lips pushed forward, cute and playful puckered look",
  "SQUINCH: lower eyelids slightly raised, confident engaging look",
  "WISTFUL: dreamy nostalgic longing look, pensive mood",
  "DOE EYES: wide innocent bambi-like eyes, vulnerable look"
];

// --- NOVO: ENCONTROS COM FAMOSOS ---
export const CELEBRITY_ENCOUNTERS = [
  "Selfie com LeBron James na quadra, ângulo de baixo para cima, iluminação de arena",
  "Selfie com Cristiano Ronaldo no campo, luzes do estádio, fundo gramado",
  "Selfie com Will Smith em uma rua da Califórnia, luz do dia natural",
  "Selfie com Donald Trump no Salão Oval, luz interna oficial",
  "Selfie com o elenco de Stranger Things no set de filmagem, luz de estúdio",
  "Selfie com Leonardo DiCaprio no aeroporto, iluminação interna de terminal",
  "Selfie com Michael Jackson no palco, luzes de show coloridas",
  "Selfie com Anitta no lobby de um hotel, iluminação ambiente suave",
  "Selfie com Ronaldinho Gaúcho na rua da cidade, luz de postes e neon"
];

export const CAMERA_STYLES = CAMERA_DATABASE.flatMap(cat => cat.items);

export const OUTFITS = [
  "Conjunto lounge canelado Skims em ônix",
  "Camiseta de algodão branca oversized",
  "Leggings de cintura alta Nike Pro e top esportivo",
  "Vestido slip de seda, joias mínimas",
  "Conjunto Lululemon Align, estética yoga",
  "Jeans vintage e regata preta",
  "Roupão de hotel de luxo, textura waffle branca",
  "Blazer oversized estruturado e shorts de ciclista",
  "Vestido de linho bege, estética cottagecore",
  "Jaqueta de couro vegano e calça cargo larga",
  "Moletom essencial Fear of God e calça jogger",
  "Biquíni minimalista texturizado tom terra",
  "Trench coat clássico Burberry sobre look casual",
  "Camisa social branca masculina (look boyfriend)",
  "Corset moderno e calça de alfaiataria",
  "Jaqueta Puffer North Face e gorro",
  "Vestido de gala de veludo vermelho",
  "Kimono de seda tradicional com estampa floral",
  "Techwear urbano, preto fosco e tiras",
  "Macacão de piloto estilo Fórmula 1"
];

// --- RANDOM GENERATOR DATA ---
const RANDOM_NAMES = ["Elara", "Yuki", "Zara", "Ines", "Lyra", "Sienna", "Kaia", "Freya", "Amara", "Nova", "Cleo", "Maya", "Elena", "Nina", "Aria"];
const RANDOM_COUNTRIES = ["Brasil", "Japão", "Itália", "Espanha", "França", "Coreia do Sul", "EUA", "Suécia", "Austrália", "Canadá"];
const RANDOM_HAIR = [
  "Cabelo loiro platinado liso e sedoso", "Cabelo preto azeviche longo e liso", "Cabelo castanho chocolate com ondas praianas", 
  "Cabelo ruivo natural cacheado volumoso", "Cabelo curto estilo pixie texturizado", "Cabelo preto com mechas azuis sutis", 
  "Cabelo loiro mel com franja cortina", "Cabelo castanho escuro preso em coque elegante"
];
const RANDOM_EYES = ["Verde esmeralda", "Castanho avelã profundo", "Azul safira brilhante", "Preto intenso", "Cinza tempestade", "Castanho mel claro"];
const RANDOM_STYLES = ["Minimalista Chic", "Streetwear Urbano", "Old Money", "Cyberpunk Soft", "Boho Natural", "Athleisure Luxo", "Vintage 90s"];
const BODY_TYPES = [
  "Corpo atlético e tonificado", "Silhueta alta e esbelta de modelo", "Corpo curvilíneo com traços suaves", "Estatura pequena e delicada", 
  "Fisiculturista fitness definida", "Elegante e magra com postura rígida"
];
const FACIAL_FEATURES = [
  "maçãs do rosto altas e definidas", "rosto redondo com covinhas sutis", "mandíbula marcada e olhar intenso", 
  "lábios cheios e nariz delicado", "sardas naturais espalhadas pelo nariz", "sobrancelhas grossas e expressivas"
];

export const generateRandomCharacter = (): Omit<Character, 'id' | 'isPremium' | 'rules'> => {
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const age = Math.floor(Math.random() * (35 - 19 + 1)) + 19;

  const body = pick(BODY_TYPES);
  const face = pick(FACIAL_FEATURES);

  const desc = `${body}, ${face}. Pele com textura natural e realista.`;

  return {
    name: pick(RANDOM_NAMES),
    age: age,
    country: pick(RANDOM_COUNTRIES),
    hair: pick(RANDOM_HAIR),
    eyes: pick(RANDOM_EYES),
    style: pick(RANDOM_STYLES),
    desc: desc
  };
};

export const CHARACTERS: Character[] = [
  {
    id: "kaizen",
    name: "Kaizen",
    age: 24,
    country: "Brasil",
    hair: "Lilás claro / roxo pastel",
    eyes: "Verdes",
    style: "UGC Ultra-realista",
    desc: "Cabelo lilás característico, corpo atlético mas feminino, sardas sutis.",
    isPremium: false,
    rules: [
      "Cabelo lilás claro - inegociável",
      "Poros da pele visíveis e microtextura",
      "Proporções naturais (sem aparência plástica de IA)",
      "Estética de influenciadora SFW"
    ]
  },
  {
    id: "aiko",
    name: "Aiko",
    age: 22,
    country: "Japão",
    hair: "Preto azeviche, liso com franja",
    eyes: "Castanhos profundos",
    style: "Minimalista Suave",
    desc: "Pequena, pele de porcelana, estilo minimalista, traços suaves.",
    isPremium: false,
    rules: [
      "Cabelo preto liso com franja reta",
      "Iluminação suave e de baixo contraste preferida",
      "Fundos minimalistas e limpos",
      "Expressões reservadas e calmas"
    ]
  },
  {
    id: "sofia",
    name: "Sofia",
    age: 23,
    country: "Itália",
    hair: "Castanho avelã, ondulado",
    eyes: "Mel",
    style: "Mediterrâneo Clássico",
    desc: "Cabelo castanho ondulado, pele oliva, presença confiante e calorosa.",
    isPremium: true,
    rules: [
      "Cabelo castanho ondulado, volume natural",
      "Foco na iluminação da golden hour",
      "Guarda-roupa clássico e elegante",
      "Calor e textura da pele visíveis"
    ]
  },
  {
    id: "luna",
    name: "Luna",
    age: 26,
    country: "Espanha",
    hair: "Expresso escuro, cacheado",
    eyes: "Castanhos escuros",
    style: "Ousada & Urbana",
    desc: "Traços marcantes, cabelo escuro cacheado, visual urbano high-fashion.",
    isPremium: true,
    rules: [
      "Cabelo escuro cacheado, alto volume",
      "Maquiagem ousada ou iluminação de alto contraste",
      "Postura forte, cenários urbanos",
      "Definição nítida da mandíbula"
    ]
  }
];

export const DNA_BASE = "Raw photo, realistic natural skin texture, soft lighting, high fidelity, 8k, unedited, SFW.";

export const generateDynamicPrompt = (character: Character, location: string, camera: string, outfit: string): string => {
  const selectedCamera = camera === "Random" 
    ? CAMERA_STYLES[Math.floor(Math.random() * CAMERA_STYLES.length)]
    : camera;

  return `Ultra-photorealistic environmental photograph of ${character.name}, a ${character.age}-year-old woman from ${character.country}. 
  
  Visual Description: ${character.desc}. Hair: ${character.hair}. Eyes: ${character.eyes}.
  
  Attire: ${outfit}.
  Environment: ${location}.
  
  Technical: ${selectedCamera}. Framing: Wide angle, full body shot. 
  Style: ${DNA_BASE}`;
};

class SeededRNG {
  private seed: number;
  constructor(seed: number) { this.seed = seed; }
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

const CATEGORIES = ['Selfie', 'Bathroom', 'Bedroom', 'Kitchen', 'Street', 'Car'] as const;

export const generatePromptsForCharacter = (char: Character, seedOffset: number = 0): Prompt[] => {
  const rng = new SeededRNG(424242 + seedOffset + char.name.length);
  const getStableRandom = <T>(arr: T[]): T => arr[Math.floor(rng.next() * arr.length)];
  const getStableIndex = (max: number): number => Math.floor(rng.next() * max);

  const newPrompts: Prompt[] = [];
  const PER_CATEGORY = 6;

  CATEGORIES.forEach(cat => {
    for (let i = 0; i < PER_CATEGORY; i++) {
      const outfit = getStableRandom(OUTFITS);
      const camera = getStableRandom(CAMERA_STYLES); 

      let baseAction = "";
      switch(cat) {
        case 'Selfie': baseAction = "tirando uma selfie no espelho mostrando o corpo todo"; break;
        case 'Bathroom': baseAction = "em pé no banheiro, corpo inteiro visível"; break;
        case 'Bedroom': baseAction = "sentada na cama, plano aberto mostrando o quarto"; break;
        case 'Kitchen': baseAction = "cozinhando, plano médio-longo"; break;
        case 'Street': baseAction = "caminhando pela rua, ângulo baixo e aberto"; break;
        case 'Car': baseAction = "sentada no carro, interior luxuoso visível ao redor"; break;
        default: baseAction = "posando naturalmente em plano aberto";
      }

      const moods = ["confiante", "serena", "pensativa", "alegre"];
      const mood = moods[getStableIndex(moods.length)];
      
      // Adicionado sorteio das novas iluminações e expressões na descrição automática
      const lighting = getStableRandom(LIGHTING_DATABASE).split(':')[0];
      const expression = getStableRandom(EXPRESSIONS_DATABASE).split(':')[0];

      const description = `${char.name} ${baseAction}, vestindo ${outfit.toLowerCase()}. Expressão ${expression.toLowerCase()} sob ${lighting.toLowerCase()}. Câmera: ${camera.split(',')[0]}.`;

      const fullPrompt = `Ultra-photorealistic lifestyle photograph of ${char.name}, ${char.age} years old from ${char.country}. 
      Visuals: ${char.desc}, ${char.hair}, ${char.eyes} eyes. 
      Action: ${baseAction}. 
      Outfit: ${outfit}. 
      Expression: ${expression}.
      Location: ${cat} setting (visible environment). 
      Camera: ${camera}. 
      Style: ${DNA_BASE} Mood: ${mood}. Lighting: ${lighting}.`;

      const id = `${char.id}-${cat.toLowerCase()}-${i}`;

      newPrompts.push({
        id,
        title: `${char.name} ${cat} #${i+1}`,
        description,
        fullPrompt,
        tags: [cat.toLowerCase(), char.id, "auto-gen", camera.split(',')[0].toLowerCase().replace(/\s/g, '-')],
        isPremium: i > 2, 
        category: cat,
        modelRecommendation: "Manus DALL-E 3"
      });
    }
  });
  return newPrompts;
};

const initialPrompts: Prompt[] = [];
CHARACTERS.forEach(char => {
  initialPrompts.push(...generatePromptsForCharacter(char));
});

export const PROMPTS: Prompt[] = initialPrompts;
