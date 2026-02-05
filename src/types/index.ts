export type Category = 'Selfie' | 'Bathroom' | 'Bedroom' | 'Kitchen' | 'Street' | 'Beauty' | 'Lifestyle' | 'Mirror' | 'Mood' | 'Car' | 'All';

export interface Prompt {
  id: string;
  title: string;
  description: string;
  fullPrompt: string;
  tags: string[];
  isPremium: boolean;
  category: string;
  modelRecommendation: string;
}

export interface Character {
  id: string;
  name: string;
  age: number;
  country: string;
  hair: string;
  eyes: string;
  style: string;
  desc: string;
  description?: string; // Database field
  isPremium: boolean;
  rules: string[];
  prompt_base?: string; // Database field
  image_url?: string; // Database field
}
