"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface Project {
  projectID: string;
  name: string;
  description: string;
  technologies: string[];
  thumbnail: string;
  status: 'En cours' | 'Terminé' | 'En pause';
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  category: string;
  tags: string[];
  promotion: string;
  githubUrl: string;
  demoUrl: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    difficulty: '',
    status: '',
    category: '',
    tag: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Non autorisé');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/projects`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Erreur lors de la récupération des projets');
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
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      project.name.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term) ||
      (Array.isArray(project.technologies) &&
        project.technologies.some(t => t.toLowerCase().includes(term))) ||
      (Array.isArray(project.tags) &&
        project.tags.some(t => t.toLowerCase().includes(term)));

    const matchesFilters =
      (!filters.difficulty || project.difficulty === filters.difficulty) &&
      (!filters.status || project.status === filters.status) &&
      (!filters.category || project.category === filters.category) &&
      (!filters.tag || (Array.isArray(project.tags) && project.tags.includes(filters.tag)));

    return matchesSearch && matchesFilters;
  });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Projets ESGI</h1>

        {/* Barre de recherche et filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher..."
            className="p-2 border rounded"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            value={filters.difficulty}
            onChange={e => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="">Tous les niveaux</option>
            <option value="Débutant">Débutant</option>
            <option value="Intermédiaire">Intermédiaire</option>
            <option value="Avancé">Avancé</option>
          </select>
          <select
            className="p-2 border rounded"
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Tous les statuts</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
            <option value="En pause">En pause</option>
          </select>
          <select
            className="p-2 border rounded"
            value={filters.category}
            onChange={e => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">Toutes les catégories</option>
            {Array.from(new Set(projects.map(p => p.category).filter(Boolean)))
              .map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
          </select>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Array.from(new Set(projects.flatMap(p => p.tags || []))).map(tag => (
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

        {/* Grille de projets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div key={project.projectID} className="bg-white rounded-lg shadow-md overflow-hidden">
              {project.thumbnail && (
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(project.technologies) && project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{project.promotion}</span>
                  <span className="text-sm text-gray-500">{project.category}</span>
                </div>
                <div className="mt-4 flex justify-end">
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
