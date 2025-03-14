#!/bin/bash
set -e

echo "=== Mise à jour vers la structure 'app' de Next.js ==="

# Supprimer l'ancien dossier pages s'il existe
if [ -d "pages" ]; then
  echo "Suppression du dossier 'pages' existant..."
  rm -rf pages
fi

# Créer la nouvelle structure 'app'
mkdir -p app/projects/[id]
mkdir -p app/admin/login
mkdir -p app/admin/dashboard
mkdir -p app/admin/create

# Créer également les dossiers utiles pour composants, lib et types
mkdir -p components lib types

# Créer ou mettre à jour le fichier tailwind.config.js
cat << 'EOF' > tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# Créer un fichier global de styles si ce n'est pas déjà fait (app/globals.css)
cat << 'EOF' > app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# 1. Fichier de layout global : app/layout.tsx
cat << 'EOF' > app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Portfolio des Projets Étudiants',
  description: 'Application portfolio built with Next.js 13 app directory and Tailwind CSS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
EOF

# 2. Page d'accueil : app/page.tsx
cat << 'EOF' > app/page.tsx
export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold">Bienvenue sur le Portfolio des Projets Étudiants</h1>
      <p className="mt-4">
        Naviguez pour découvrir les projets ou connectez-vous en tant qu'administrateur.
      </p>
    </main>
  );
}
EOF

# 3. Page listant les projets : app/projects/page.tsx
cat << 'EOF' > app/projects/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data.projects));
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Projets Étudiants</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="border rounded p-4">
            <h2 className="text-xl font-semibold">{project.Name}</h2>
            <p>{project.Description.substring(0, 100)}...</p>
            <Link href={\`/projects/\${project.id}\`}>
              <a className="text-blue-500 underline">Voir le détail</a>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
EOF

# 4. Page détail d'un projet : app/projects/[id]/page.tsx
cat << 'EOF' > app/projects/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Project {
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

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (id) {
      fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/projects/" + id)
        .then((res) => res.json())
        .then((data) => setProject(data.project));
    }
  }, [id]);

  const handleLike = async () => {
    if (project && project.id) {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/projects/" + project.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });
      const data = await res.json();
      setProject({ ...project, Likes: data.Likes });
    }
  };

  if (!project) return <div>Chargement...</div>;

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{project.Name}</h1>
      <p>{project.Description}</p>
      <p><strong>Technologies :</strong> {project.Technologies.join(", ")}</p>
      {project.Link && (
        <p>
          <a href={project.Link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            Voir le projet en ligne
          </a>
        </p>
      )}
      <p className="mt-4">Likes: {project.Likes}</p>
      <button onClick={handleLike} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Liker
      </button>
    </main>
  );
}
EOF

# 5. Page de connexion administrateur : app/admin/login/page.tsx
cat << 'EOF' > app/admin/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.error) {
      setError(data.error);
    } else {
      // Redirection vers le dashboard admin
      router.push("/admin/dashboard");
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Connexion Administrateur</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full" required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full" required />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Se connecter</button>
      </form>
    </main>
  );
}
EOF

# 6. Page dashboard administrateur : app/admin/dashboard/page.tsx
cat << 'EOF' > app/admin/dashboard/page.tsx
export default function AdminDashboard() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
      <p>Statistiques et gestion des projets</p>
      <div className="mt-4">
        <a href="/admin/create" className="text-blue-500 underline">Créer un nouveau projet</a>
      </div>
    </main>
  );
}
EOF

# 7. Page de création d'un projet pour l'administrateur : app/admin/create/page.tsx
cat << 'EOF' > app/admin/create/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    Name: "",
    Description: "",
    Technologies: "",
    Link: "",
    Promotion: "",
    Students: "",
    Category: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const project = {
      ...form,
      Technologies: form.Technologies.split(","),
      Students: form.Students.split(",")
    };
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    const data = await res.json();
    if (data.id) {
      router.push("/admin/dashboard");
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Créer un nouveau projet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="Name" placeholder="Nom du projet" value={form.Name} onChange={handleChange} className="border p-2 w-full" required />
        <textarea name="Description" placeholder="Description" value={form.Description} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="Technologies" placeholder="Technologies (séparées par des virgules)" value={form.Technologies} onChange={handleChange} className="border p-2 w-full" />
        <input type="url" name="Link" placeholder="Lien du projet" value={form.Link} onChange={handleChange} className="border p-2 w-full" />
        <input type="text" name="Promotion" placeholder="Promotion" value={form.Promotion} onChange={handleChange} className="border p-2 w-full" />
        <input type="text" name="Students" placeholder="Étudiants (séparés par des virgules)" value={form.Students} onChange={handleChange} className="border p-2 w-full" />
        <input type="text" name="Category" placeholder="Catégorie" value={form.Category} onChange={handleChange} className="border p-2 w-full" />
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Créer le projet</button>
      </form>
    </main>
  );
}
EOF

echo "=== Nouvelle structure 'app' de Next.js créée avec succès ==="
echo "N'oubliez pas de créer un fichier .env.local à la racine avec la variable NEXT_PUBLIC_API_BASE_URL (ex: NEXT_PUBLIC_API_BASE_URL=http://localhost:5000)"
