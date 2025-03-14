export interface Project {
  id?: string;
  Name: string;
  Description: string;
  Technologies: string[];
  Link?: string;
  Visuals?: any[];
  Promotion?: string;
  Students?: string[];
  Category: string;
  Visible: boolean;
  Likes: number;
}

export interface User {
  id?: string;
  Username: string;
  Email: string;
  Role: 'admin' | 'user';
}
