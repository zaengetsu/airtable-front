'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
// import ImageUpload from '@/src/components/ImageUpload';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ProjectForm {
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
}

export default function NewProject() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<ProjectForm>({
    name: '',
    description: '',
    technologies: '',
    projectLink: '',
    githubLink: '',
    demoLink: '',
    images: '',
    thumbnail: '',
    promotion: '',
    students: '',
    category: '',
    tags: '',
    status: 'En cours',
    difficulty: 'Débutant',
    startDate: new Date().toISOString(),
    endDate: '',
    mentor: '',
    achievements: '',
    isHidden: false
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [currentTechnology, setCurrentTechnology] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const loadFormData = async () => {
      try {
        const response = await fetch('/api/projects/new', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erreur lors du chargement des données');
        }

        const data = await response.json();
        setCategories(data.categories);
        setDifficulties(data.difficulties);
        setStatuses(data.statuses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      }
    };

    loadFormData();
  }, [router, token, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création du projet');
      }

      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, thumbnail: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: prev.tags ? `${prev.tags}, ${newTag.trim()}` : newTag.trim()
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags
        .split(', ')
        .filter(tag => tag !== tagToRemove)
        .join(', ')
    }));
  };

  const addTechnology = () => {
    if (currentTechnology && !formData.technologies.includes(currentTechnology)) {
      setFormData({
        ...formData,
        technologies: formData.technologies ? `${formData.technologies}, ${currentTechnology}` : currentTechnology
      });
      setCurrentTechnology('');
    }
  };

  const removeTechnology = (techToRemove: string) => {
    const techs = formData.technologies.split(', ').filter(tech => tech !== techToRemove);
    setFormData({
      ...formData,
      technologies: techs.join(', ')
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">Informations du projet</h2>
            <p className="mt-1 text-sm/6 text-gray-600">Remplissez les informations de base sur votre projet.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">Nom du projet *</label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="category" className="block text-sm/6 font-medium text-gray-900">Catégorie *</label>
                <div className="mt-2">
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    required
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="promotion" className="block text-sm/6 font-medium text-gray-900">Promotion *</label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="promotion"
                    value={formData.promotion}
                    onChange={(e) => setFormData({ ...formData, promotion: e.target.value })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Ex: M2 S2"
                    required
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">Description *</label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    required
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="students" className="block text-sm/6 font-medium text-gray-900">Étudiants</label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="students"
                    value={formData.students}
                    onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Séparez les noms par des virgules"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">Détails techniques</h2>
            <p className="mt-1 text-sm/6 text-gray-600">Informations sur les technologies utilisées et l'état du projet.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="status" className="block text-sm/6 font-medium text-gray-900">Statut</label>
                <div className="mt-2">
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectForm['status'] })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    required
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="difficulty" className="block text-sm/6 font-medium text-gray-900">Difficulté</label>
                <div className="mt-2">
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as ProjectForm['difficulty'] })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    required
                  >
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-span-full">
                <label className="block text-sm/6 font-medium text-gray-900">Technologies</label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={currentTechnology}
                    onChange={(e) => setCurrentTechnology(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Ajouter une technologie"
                  />
                  <button
                    type="button"
                    onClick={addTechnology}
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.technologies.split(', ').map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="col-span-full">
                <label className="block text-sm/6 font-medium text-gray-900">Tags</label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Ajouter un tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags ? (
                    formData.tags.split(', ').map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">Liens et dates</h2>
            <p className="mt-1 text-sm/6 text-gray-600">Ajoutez les liens vers votre projet et les dates importantes.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="githubLink" className="block text-sm/6 font-medium text-gray-900">Lien GitHub</label>
                <div className="mt-2">
                  <input
                    type="url"
                    id="githubLink"
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="demoLink" className="block text-sm/6 font-medium text-gray-900">Lien de démo</label>
                <div className="mt-2">
                  <input
                    type="url"
                    id="demoLink"
                    value={formData.demoLink}
                    onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="startDate" className="block text-sm/6 font-medium text-gray-900">Date de début *</label>
                <div className="mt-2">
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate.split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value).toISOString() })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="endDate" className="block text-sm/6 font-medium text-gray-900">Date de fin *</label>
                <div className="mt-2">
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate?.split('T')[0] || ''}
                    onChange={(e) => {
                      const endDate = new Date(e.target.value).toISOString();
                      if (new Date(endDate) < new Date(formData.startDate)) {
                        setError('La date de fin doit être postérieure à la date de début');
                        return;
                      }
                      setFormData({ ...formData, endDate });
                      setError(null);
                    }}
                    min={formData.startDate.split('T')[0]}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-sm/6 font-semibold text-gray-900"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400"
            >
              {loading ? 'Création en cours...' : 'Créer le projet'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
} 