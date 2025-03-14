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
