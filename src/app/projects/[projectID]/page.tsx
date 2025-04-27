'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { PaperClipIcon, XMarkIcon } from '@heroicons/react/20/solid';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const TECHNOLOGIES = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular',
  'Node.js', 'Express', 'NestJS', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot',
  'PHP', 'Laravel', 'Symfony', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker',
  'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'GitHub', 'GitLab', 'CI/CD',
  'REST API', 'GraphQL', 'WebSocket', 'JWT', 'OAuth', 'Sass', 'Tailwind CSS',
  'Bootstrap', 'Material UI', 'Ant Design', 'Redux', 'MobX', 'Jest', 'Cypress',
  'Webpack', 'Babel', 'ESLint', 'Prettier'
];

const STATUS_OPTIONS = ['En cours', 'Terminé', 'En pause'];
const DIFFICULTY_OPTIONS = ['Débutant', 'Intermédiaire', 'Avancé'];

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
  authorId: string;
}

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newStudent, setNewStudent] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newTechnology, setNewTechnology] = useState('');
  const { isAdmin, isAuthor } = useAuth();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
          'Accept': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/projects/${params.projectID}`, {
          headers
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erreur lors de la récupération du projet');
        }

        const data = await response.json();
        setProject({
          ...data,
          technologies: data.technologies || '',
          students: data.students || '',
          tags: data.tags || ''
        });
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

  const handleLike = async () => {
    if (!project || likeLoading) return;

    setLikeLoading(true);
    try {
      const response = await fetch(`${API_URL}/projects/${project.projectID}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors du like');
      }

      const data = await response.json();
      setProject(prev => prev ? {
        ...prev,
        likes: data.likes,
        isLiked: data.isLiked
      } : null);
      setSuccessMessage('Merci pour votre like !');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!project) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour modifier un projet');
        return;
      }

      const response = await fetch(`${API_URL}/projects/${project.projectID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(project)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour');
      }

      setSuccessMessage('Projet mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(null), 3000);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleDelete = async () => {
    if (!project) return;

    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/projects/${project.projectID}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erreur lors de la suppression');
        }

        router.push('/');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      }
    }
  };

  const addStudent = () => {
    if (newStudent.trim() && project) {
      setProject({
        ...project,
        students: project.students ? `${project.students}, ${newStudent.trim()}` : newStudent.trim()
      });
      setNewStudent('');
    }
  };

  const removeStudent = (index: number) => {
    if (project) {
      const students = project.students.split(', ').filter((_, i) => i !== index);
      setProject({
        ...project,
        students: students.join(', ')
      });
    }
  };

  const addTag = () => {
    if (newTag.trim() && project) {
      setProject({
        ...project,
        tags: project.tags ? `${project.tags}, ${newTag.trim()}` : newTag.trim()
      });
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    if (project) {
      const tags = project.tags.split(', ').filter((_, i) => i !== index);
      setProject({
        ...project,
        tags: tags.join(', ')
      });
    }
  };

  const addTechnology = () => {
    if (newTechnology.trim() && project) {
      setProject({
        ...project,
        technologies: project.technologies ? `${project.technologies}, ${newTechnology.trim()}` : newTechnology.trim()
      });
      setNewTechnology('');
    }
  };

  const removeTechnology = (techToRemove: string) => {
    if (project) {
      const techs = project.technologies.split(', ').filter(tech => tech !== techToRemove);
      setProject({
        ...project,
        technologies: techs.join(', ')
      });
    }
  };

  const canEdit = isAdmin || (project && isAuthor(project.authorId));

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
  
  if (!project) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600 text-xl">Projet non trouvé</div>
    </div>
  );

  if (project.isHidden) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-600 text-xl">Ce projet n'est pas disponible actuellement.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4">
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Retour aux projets
          </Link>
          {canEdit && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {isEditing ? 'Annuler' : 'Modifier'}
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          )}
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
            <div className="px-4 sm:px-0">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du projet</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => setProject({ ...project, name: e.target.value })}
                    className="text-base/7 font-semibold text-gray-900 w-full p-2 border rounded"
                  />
                ) : (
                  <h3 className="text-base/7 font-semibold text-gray-900">{project.name}</h3>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                {isEditing ? (
                  <textarea
                    value={project.description}
                    onChange={(e) => setProject({ ...project, description: e.target.value })}
                    className="mt-1 max-w-2xl text-sm/6 text-gray-500 w-full p-2 border rounded"
                    rows={3}
                  />
                ) : (
                  <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">{project.description}</p>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">Statut</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {isEditing ? (
                      <select
                        value={project.status}
                        onChange={(e) => setProject({ ...project, status: e.target.value as any })}
                        className="border rounded p-2 w-full"
                      >
                        {STATUS_OPTIONS.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        project.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    )}
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">Difficulté</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {isEditing ? (
                      <select
                        value={project.difficulty}
                        onChange={(e) => setProject({ ...project, difficulty: e.target.value as any })}
                        className="border rounded p-2 w-full"
                      >
                        {DIFFICULTY_OPTIONS.map(difficulty => (
                          <option key={difficulty} value={difficulty}>{difficulty}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        project.difficulty === 'Débutant' ? 'bg-green-100 text-green-800' :
                        project.difficulty === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {project.difficulty}
                      </span>
                    )}
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">Technologies</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.split(', ').map((tech, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {tech}
                          {isEditing && (
                            <button
                              onClick={() => removeTechnology(tech)}
                              className="text-blue-800 hover:text-blue-900"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="mt-2">
                        <select
                          value={newTechnology}
                          onChange={(e) => setNewTechnology(e.target.value)}
                          className="border rounded p-2 w-full"
                        >
                          <option value="">Sélectionner une technologie</option>
                          {TECHNOLOGIES.map(tech => (
                            <option key={tech} value={tech}>{tech}</option>
                          ))}
                        </select>
                        <button
                          onClick={addTechnology}
                          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                          Ajouter
                        </button>
                      </div>
                    )}
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">Étudiants</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <div className="flex flex-wrap gap-2">
                      {project.students.split(', ').map((student, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {student}
                          {isEditing && (
                            <button
                              onClick={() => removeStudent(index)}
                              className="text-purple-800 hover:text-purple-900"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          value={newStudent}
                          onChange={(e) => setNewStudent(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addStudent()}
                          placeholder="Ajouter un étudiant"
                          className="border rounded p-1 text-sm"
                        />
                        <button
                          onClick={addStudent}
                          className="bg-purple-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Ajouter
                        </button>
                      </div>
                    )}
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">Tags</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.split(', ').map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {tag}
                          {isEditing && (
                            <button
                              onClick={() => removeTag(index)}
                              className="text-gray-800 hover:text-gray-900"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          placeholder="Ajouter un tag"
                          className="border rounded p-1 text-sm"
                        />
                        <button
                          onClick={addTag}
                          className="bg-gray-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Ajouter
                        </button>
                      </div>
                    )}
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">Promotion</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {isEditing ? (
                      <input
                        type="text"
                        value={project.promotion}
                        onChange={(e) => setProject({ ...project, promotion: e.target.value })}
                        className="border rounded p-2 w-full"
                      />
                    ) : (
                      project.promotion
                    )}
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">Catégorie</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {isEditing ? (
                      <input
                        type="text"
                        value={project.category}
                        onChange={(e) => setProject({ ...project, category: e.target.value })}
                        className="border rounded p-2 w-full"
                      />
                    ) : (
                      project.category
                    )}
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">Liens</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <div className="flex gap-4">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={project.githubUrl}
                            onChange={(e) => setProject({ ...project, githubUrl: e.target.value })}
                            placeholder="URL GitHub"
                            className="border rounded p-2"
                          />
                          <input
                            type="text"
                            value={project.demoUrl}
                            onChange={(e) => setProject({ ...project, demoUrl: e.target.value })}
                            placeholder="URL de la démo"
                            className="border rounded p-2"
                          />
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm/6 font-medium text-gray-900">Likes</dt>
                  <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <button
                      onClick={handleLike}
                      disabled={likeLoading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                        project.isLiked 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span>{project.likes}</span>
                      <svg 
                        className={`w-5 h-5 ${project.isLiked ? 'fill-red-600' : 'fill-gray-600'}`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="fixed bottom-4 right-4">
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Enregistrer les modifications
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
