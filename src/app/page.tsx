"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface Project {
  projectID: string;
  name: string;
  description: string;
  technologies: string;
  thumbnail: string;
  status: 'En cours' | 'Terminé' | 'En pause';
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  category: string;
  tags: string;
  promotion: string;
  students: string;
  githubUrl: string;
  demoUrl: string;
  likes: number;
  isLiked: boolean;
  isHidden: boolean;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    difficulty: '',
    status: '',
    category: '',
    tag: '',
    promotion: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
          'Accept': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/projects`, {
          headers
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erreur lors de la récupération des projets');
        }

        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    if (project.isHidden) return false;

    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (project.name?.toLowerCase() || '').includes(searchTermLower) ||
      (project.description?.toLowerCase() || '').includes(searchTermLower) ||
      (project.technologies?.toLowerCase() || '').includes(searchTermLower) ||
      (project.tags?.toLowerCase() || '').includes(searchTermLower) ||
      (project.students?.toLowerCase() || '').includes(searchTermLower);

    const matchesFilters = 
      (!filters.difficulty || project.difficulty === filters.difficulty) &&
      (!filters.status || project.status === filters.status) &&
      (!filters.category || project.category === filters.category) &&
      (!filters.promotion || project.promotion === filters.promotion) &&
      (!filters.tag || (project.tags?.includes(filters.tag) || false));

    return matchesSearch && matchesFilters;
  });

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Erreur: {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Projets ESGI</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <input
              type="text"
              placeholder="Rechercher..."
              className="p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-2 border rounded"
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            >
              <option value="">Tous les niveaux</option>
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
            </select>
            <select
              className="p-2 border rounded"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Tous les statuts</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="En pause">En pause</option>
            </select>
            <select
              className="p-2 border rounded"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">Toutes les catégories</option>
              {Array.from(new Set(projects.map(p => p.category).filter(Boolean))).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              className="p-2 border rounded"
              value={filters.promotion}
              onChange={(e) => setFilters({ ...filters, promotion: e.target.value })}
            >
              <option value="">Toutes les promotions</option>
              {Array.from(new Set(projects.map(p => p.promotion).filter(Boolean))).map(promotion => (
                <option key={promotion} value={promotion}>{promotion}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {Array.from(new Set(projects.flatMap(p => p.tags?.split(', ') || []))).map(tag => (
              <button
                key={tag}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.tag === tag
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setFilters({ ...filters, tag: filters.tag === tag ? '' : tag })}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.projectID} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {project.thumbnail && (
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">{project.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{project.likes} ❤️</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                
                {/* Technologies */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies ? (
                      project.technologies.split(', ').map((tech, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Aucune technologie</span>
                    )}
                  </div>
                </div>

                {/* Membres */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Membres</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.students ? (
                      project.students.split(', ').map((student, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                          {student}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Aucun membre</span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags ? (
                      project.tags.split(', ').map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Aucun tag</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">{project.promotion}</span>
                  <span className="text-sm text-gray-500">{project.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      project.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                      project.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      project.difficulty === 'Débutant' ? 'bg-green-100 text-green-800' :
                      project.difficulty === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {project.difficulty}
                    </span>
                  </div>
                  <Link
                    href={`/projects/${project.projectID}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Voir plus
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
