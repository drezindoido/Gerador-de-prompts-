export type Category = 'Selfie' | 'Bathroom' | 'Bedroom' | 'Kitchen' | 'Street' | 'Beauty' | 'Lifestyle' | 'Mirror' | 'Mood' | 'Car' | 'All';

export interface Prompt {
  id: string;
  title: string;
  description: string;
  fullPrompt: string;
  tags: string[];
  isPremium: boolean;
  category: Category;
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
  isPremium: boolean;
  rules: string[];
}
