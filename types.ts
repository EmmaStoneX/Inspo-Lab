export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: number;
}

export interface Inspiration {
  title: string;
  prompt: string;
  thumbnail: string;
}

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
