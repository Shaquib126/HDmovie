export interface Movie {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  release_year: number;
  quality: string;
  category: string;
  size: string;
  language: string;
  download_links: string; // JSON string
  is_trending: number;
  created_at: string;
}

export type Category = 'Bollywood' | 'Hollywood' | 'South' | 'Web-Series';
