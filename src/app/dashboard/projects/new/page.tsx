'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const [formData, setFormData] = useState<ProjectForm>({
    name: '',
    description: '',
    technologies: '',
    projectLink: '',
    githubLink: '',
    demoLink: '',
    images: '',
    thumbnail: '',
    promotion: 'ESGI',
    students: '',
    category: 'Web',
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
  const [currentTechnology, setCurrentTechnology] = useState('');
  const [categories] = useState<string[]>(['Web', 'Mobile', 'Desktop', 'API', 'Autre']);
  const [difficulties] = useState<string[]>(['Débutant', 'Intermédiaire', 'Avancé']);
  const [statuses] = useState<string[]>(['En cours', 'Terminé', 'En pause']);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation des champs requis
    if (!formData.name || !formData.description || !formData.category || !formData.promotion) {
      setError('Veuillez remplir tous les champs requis');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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

              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm/6 font-medium text-gray-900">Catégorie *</label>
                <div className="mt-2">
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="promotion" className="block text-sm/6 font-medium text-gray-900">Promotion *</label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="promotion"
                    value={formData.promotion}
                    onChange={(e) => setFormData({ ...formData, promotion: e.target.value })}
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
                    placeholder="Séparer les noms par des virgules"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="achievements" className="block text-sm/6 font-medium text-gray-900">Réalisations</label>
                <div className="mt-2">
                  <textarea
                    id="achievements"
                    rows={3}
                    value={formData.achievements}
                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Décrivez les réalisations du projet"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="mentor" className="block text-sm/6 font-medium text-gray-900">Mentor</label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="mentor"
                    value={formData.mentor}
                    onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    placeholder="Nom du mentor"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ... rest of the form ... */}
        </form>
      </main>
    </div>
  );
} 