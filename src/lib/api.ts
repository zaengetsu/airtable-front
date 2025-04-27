const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function fetchProjects() {
  const res = await fetch(\`\${API_BASE_URL}/api/projects\`);
  return res.json();
}

export async function fetchProjectById(id: string) {
  const res = await fetch(\`\${API_BASE_URL}/api/projects/\${id}\`);
  return res.json();
}

export async function likeProject(id: string) {
  const res = await fetch(\`\${API_BASE_URL}/api/projects/\${id}\`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'like' })
  });
  return res.json();
}

export async function createProject(project: any) {
  const res = await fetch(\`\${API_BASE_URL}/api/projects\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  });
  return res.json();
}

export async function updateProject(id: string, project: any) {
  const res = await fetch(\`\${API_BASE_URL}/api/projects/\${id}\`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  });
  return res.json();
}

export async function deleteProject(id: string) {
  const res = await fetch(\`\${API_BASE_URL}/api/projects/\${id}\`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(\`\${API_BASE_URL}/api/auth/login\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function register(user: any) {
  const res = await fetch(\`\${API_BASE_URL}/api/auth/register\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  return res.json();
}
