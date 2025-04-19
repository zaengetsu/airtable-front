'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Non autorisé');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/projects/${params.projectID}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Erreur lors de la récupération du projet');
        }

        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (params.projectID) {
      fetchProject();
    }
  }, [params.projectID]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!project) return <div>Projet non trouvé</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4">
        <div className="mb-4">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Retour aux projets
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {project.thumbnail && (
            <div className="h-64 w-full relative">
              <img
                src={project.thumbnail}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  project.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                  project.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  project.difficulty === 'Débutant' ? 'bg-green-100 text-green-800' :
                  project.difficulty === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {project.difficulty}
                </span>
              </div>
            </div>

            <p className="text-gray-700 text-lg mb-6">{project.description}</p>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Technologies utilisées</h2>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(project.technologies) && project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(project.tags) && project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Promotion</h2>
                <p className="text-gray-700">{project.promotion}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Catégorie</h2>
                <p className="text-gray-700">{project.category}</p>
              </div>
            </div>

            <div className="flex gap-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  GitHub
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Voir la démo
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
