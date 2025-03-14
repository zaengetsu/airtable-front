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
