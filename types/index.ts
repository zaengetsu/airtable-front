export interface Project {
  projectID: string;
  name: string;
  description: string;
  technologies: string;
  projectLink?: string;
  githubLink?: string;
  demoLink?: string;
  images: string;
  thumbnail?: string;
  promotion: string;
  students: string;
  category: string;
  tags: string;
  status: 'En cours' | 'Terminé' | 'En pause';
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  startDate: string;
  endDate?: string;
  mentor?: string;
  achievements?: string;
  isHidden: boolean;
  likes: number;
}

export interface User {
  id?: string;
  Username: string;
  Email: string;
  Role: 'admin' | 'user';
}
