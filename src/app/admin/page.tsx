'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

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
}

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      console.error('Erreur lors de la récupération des projets:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la récupération des projets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchProjects();
  }, [router]);

  const handleDelete = async (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du projet');
      }

      setProjects(projects.filter(p => p.projectID !== projectId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">Erreur</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchProjects();
              }}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Administration des projets</h1>
          <button
            onClick={() => router.push('/admin/create')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Nouveau projet
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Nombre total de projets */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Projets</h3>
            <p className="text-3xl font-bold text-blue-600">{projects.length}</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                {projects.filter(p => p.status === 'En cours').length} en cours
              </p>
              <p className="text-sm text-gray-500">
                {projects.filter(p => p.status === 'Terminé').length} terminés
              </p>
            </div>
          </div>

          {/* Technologies utilisées */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Technologies</h3>
            <p className="text-3xl font-bold text-green-600">
              {new Set(projects.flatMap(p => p.technologies.split(', '))).size}
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Technologies uniques
              </p>
            </div>
          </div>

          {/* Étudiants */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Étudiants</h3>
            <p className="text-3xl font-bold text-purple-600">
              {new Set(projects.flatMap(p => p.students.split(', '))).size}
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Étudiants uniques
              </p>
            </div>
          </div>

          {/* Difficulté moyenne */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Difficulté</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Débutant: {projects.filter(p => p.difficulty === 'Débutant').length}
              </p>
              <p className="text-sm text-gray-500">
                Intermédiaire: {projects.filter(p => p.difficulty === 'Intermédiaire').length}
              </p>
              <p className="text-sm text-gray-500">
                Avancé: {projects.filter(p => p.difficulty === 'Avancé').length}
              </p>
            </div>
          </div>
        </div>

        {/* Liste des étudiants et leurs projets */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Étudiants et leurs projets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(new Set(projects.flatMap(p => p.students.split(', '))))
              .filter(student => student.trim() !== '')
              .map(student => (
                <div key={student} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{student}</h3>
                  <ul className="text-sm text-gray-600">
                    {projects
                      .filter(p => p.students.includes(student))
                      .map(p => (
                        <li key={p.projectID} className="mb-1">
                          {p.name} ({p.status})
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>

        {/* Technologies utilisées */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Technologies utilisées</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(projects.flatMap(p => p.technologies.split(', '))))
              .filter(tech => tech.trim() !== '')
              .map(tech => (
                <span key={tech} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {tech} ({projects.filter(p => p.technologies.includes(tech)).length})
                </span>
              ))}
          </div>
        </div>

        {/* Tableau des projets */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulté
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.projectID}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {project.thumbnail && (
                        <img
                          className="h-10 w-10 rounded-full mr-3 object-cover"
                          src={project.thumbnail}
                          alt={project.name}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{project.name}</div>
                        <div className="text-sm text-gray-500">{project.promotion}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      project.status === 'En cours'
                        ? 'bg-yellow-100 text-yellow-800'
                        : project.status === 'Terminé'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.difficulty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/projects/${project.projectID}`)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(project.projectID)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
} 