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
