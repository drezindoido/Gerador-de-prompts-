
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

export type ImageSize = '1K' | '2K' | '4K';
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface GenerationSettings {
  size: ImageSize;
  aspectRatio: AspectRatio;
}

export interface CameraCategory {
  category: string;
  items: string[];
}
