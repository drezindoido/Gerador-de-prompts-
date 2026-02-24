import { Character } from '@/types';
import { useState } from 'react';

// --- BIBLIOTECAS MANTIDAS ---
export const LIGHTING_DATABASE = [
  "GOLDEN HOUR: warm low-angle sunset sunlight, soft specular highlights, natural light wrap",
  "RIM LIGHTING: strong backlight creating luminous edge definition, pronounced separation",
  "NATURAL LIGHT: soft diffused window daylight, smooth tonal transitions, professionals lifestyle look",
  "CHIAROSCURO: dramatic light falloff, strong directional key light, deep cinematic shadows",
  "NEON NIGHT: vibrant cyberpunk highlights, harsh reflections, futuristic urban lighting"
];

export const EXPRESSIONS_DATABASE = [
  "SMIRK: asymmetrical smile with one corner raised, confident knowing expression",
  "POUT: lips pushed forward and slightly puckered, cute playful intensity",
  "SMOLDER: intense seductive gaze, eyes looking up through lashes, piercing stare",
  "DUCHENNE: genuine authentic happy smile involving mouth and eyes, crow's feet",
  "DOE EYES: wide innocent bambi-like eyes, eyebrows slightly raised, soft look",
  "WISTFUL: dreamy nostalgic longing look, eyes gazing off-camera, pensive mood"
];

export const CELEBRITY_ENCOUNTERS = [
  "Taking a rushed selfie with Cristiano Ronaldo on a football pitch, stadium lights",
  "Standing beside LeBron James on a basketball court, arena lighting, wide angle",
  "Spontaneous selfie with Donald Trump inside the Oval Office, official decor",
  "Casual encounter selfie with Anitta in a luxury hotel lobby, warm ambient light",
  "Smiling beside Ronaldinho Gaúcho on a busy street, night life vibe",
  "A fun selfie with Neymar Jr at a VIP party, flash photography aesthetic"
];

// --- PERSONAGENS MANTIDOS ---
export const characters: Character[] = [
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
      "Iluminação suave e de baixo contraste",
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

// --- O HOOK (ESTRUTURA QUE O GENERATOR EXIGE) ---
function useCharacters() {
  const [loading] = useState(false);
  return {
    characters,
    loading
  };
}

// Exportação explícita para forçar o Rollup a indexar a função
export { useCharacters };
