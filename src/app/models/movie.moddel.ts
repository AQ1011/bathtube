import { User } from "@angular/fire/auth";

export interface Movie {
  videoId: string;
  name: string;
  description: string;
  serie: string | null;
  year: number;
  rating: number;
  comments: Comment[]
  daoDien: string;
  dienVien: string;
  tags: string[];
  image: string;
}

interface Comment {
  user: User;
  content: string;
  timeCreated: Date;
}