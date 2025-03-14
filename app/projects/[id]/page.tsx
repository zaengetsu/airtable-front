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
